var o;
function chooseCoupon(coupon) {
	if(coupon == null) {
		o.model.coupon=null;
		o.model.couponDesc = '未使用';
	} else {
		o.model.coupon = coupon;
		o.model.couponDesc = "￥"+coupon.amount+"元";
	}
	computeAmount();
	o.control.currentPage='main';
}
function computeAmount(){
	var count = 0;
	var amount = 0;
	for(var i=0;i<o.model.items.length;i++){
		if(o.model.items[i]!=null&&o.model.items[i]){
			count+=o.model.items[i].count;
			amount+=o.model.items[i].count*o.model.items[i].price;
		}
	}
	o.model.totalCount = count;
	o.model.totalAmount = amount.toFixed(2);

	var discountTime = Math.floor(o.model.totalAmount/o.model.collocation.satisfyAmount);
	o.model.discountAmount = o.model.collocation.discountAmount * discountTime;
	if (isNaN(o.model.discountAmount)) {
				o.model.discountAmount=0;
			}
	o.disCountAmount = o.model.discountAmount.toFixed(2);
	amount = amount-o.model.discountAmount;

	if(o.model.collocation.freeShipAmount <= 0 || o.model.collocation.freeShipAmount > amount){
		o.model.logisticsFee = o.model.collocation.shipAmount;
		amount = amount + o.model.collocation.shipAmount;
		o.disLogisticsFee=true;
	}else{
		o.model.logisticsFee = 0;
		o.disLogisticsFee=false;
	}
	
	if(o.model.coupon != null){
		o.model.discountAmount += o.model.coupon.amount;
		amount = amount - o.model.coupon.amount;
	}
	if(amount>0) {
	o.model.realAmount = amount.toFixed(2);
    } else {
        o.model.realAmount = "0.01";
    }
}

function getParam(){
	o.marketBuy=getUrlParam("marketBuy");
	if(o.marketBuy){
		o.logisticFeeDisplay='配送费';
	}
}

avalon.ready(function() {

	function queryBuyInfo(){
		var n = "GET",
        a = "collocation/getCartWithAddr",
        i = null,
        e = function(n) {
			commonui.initPage();
			console.log("success:" + JSON.stringify(n));
			o.model.collocation = n.result.collocation;
			o.model.items = n.result.cart.items;
			o.model.address = n.result.address;
			computeAmount();
            initWechat(['chooseWXPay','onMenuShareTimeline','onMenuShareAppMessage']);
    	},
        r = function() {
    		alert("获取购物车信息失败，请耐心重试！")
    		//location.href=MasterConfig.C("basePageUrl")+"group/success.html?orderId="+o.orderId;
    	};
        common.invokeApi(n, a, i, null, e, r)
	}
	function queryCoupon() {
        common.invokeApi("GET", "coupon/valid4Cart", null, null, function(n){
        	setupCoupons(n.result);
        	o.model.couponNum=getCouponNum();
        }, function(n){alert('获取现金券信息失败！')});
	}


	function createOrder(order) {
    	o.control.paying=true;
    	if(o.model.order!={}&&o.model.order.id>0) {
    		requestPay();
    		return;
    	}
        commonui.showAjaxLoading();
        common.invokeApi("POST", "createOrder4Cart", order, null, function(n) {
        	commonui.hideAjaxLoading();
        	o.model.order = n.result;
        	requestPay();
        }, function(n) {
        	commonui.hideAjaxLoading();
			alert(n.message==null?"订单创建失败，请稍后重试！":n.message);
			o.control.paying=false;
        });
    }
    
    function requestPay() {
    	
    	initWechat(['chooseWXPay','onMenuShareTimeline','onMenuShareAppMessage']);
    	
    	commonui.showAjaxLoading();
		$("#zzmb").show();
    	if($(window).height()>$(document).height()){
    		$(".zzmb").height($(window).height());
    	}else{
    		$(".zzmb").height($(document).height());
    	}
    	
    	var n = "GET",
        a = "/requestPay/"+o.model.order.id,
        i = null,
        e = function(n) {
        	wx.chooseWXPay({
              "timestamp":n.result.timestamp,
              "nonceStr":n.result.nonceStr,
              "package":n.result.pkgStr,
              "signType":n.result.signType,
              "paySign":n.result.signature,
        	   success: function (res) {
        	        // 支付成功后的回调函数
        		   alert("下单成功！");
		    	   location.href=MasterConfig.C("basePageUrl")+"group/success.html?orderId="+o.model.order.id + "&type="+o.model.type+"&marketBuy="+o.marketBuy;
        	   },
        	   fail:function(res) {
         	    	alert(JSON.stringify(res));
         	    	o.control.paying=false;
		        	commonui.hideAjaxLoading();
		        	$("#zzmb").hide();
	      	    },
	      	    cancel:function(res){
					console.log(JSON.stringify(n));
					o.control.paying=false;
			        commonui.hideAjaxLoading();
			        $("#zzmb").hide();
				}
        	});
        },
        r = function(n) {
        	alert(n.message==null?"支付请求失败，请稍后重试！":n.message);
        	o.control.paying=false;
        };
        common.invokeApi(n, a, i, null, e, r)
    }
    function notifyPaySuccess() {
    	var n = "GET",
        a = "notifyPayed/"+o.model.order.id,
        i = null,
        e = function(n) {
    		location.href=MasterConfig.C("basePageUrl")+"group/success.html?orderId="+o.model.order.id;
    	},
        r = function() {
    		alert("订单处理中，请稍后查看状态！")
    		location.href=MasterConfig.C("basePageUrl")+"orderdetail.html?orderId="+o.model.order.id;
    		//location.href=MasterConfig.C("basePageUrl")+"group/success.html?orderId="+o.orderId;
    	};
        common.invokeApi(n, a, i, null, e, r)
    }
    o = avalon.define({
        $id: "root",
        control:{
        	currentPage:"main",
        	paying:false
        },
        location:'',
        detaillocation:'',
        disCountAmount:0,
        disLogisticsFee:true,
        marketBuy:0,		//是否为超时快购
        logisticFeeDisplay:'快递费',
        
        model:{
        	type:3,/**默认特卖*/
        	collocation: {},
        	address:{},
        	items:[],
        	order:{},
        	totalAmount:0,
        	totalCount:0,
        	logisticsFee:0,
        	discountAmount:0,
        	realAmount:0,
        	couponNum:0,
        	coupon:null,
        	couponDesc:'未使用',
        	comment:'',
            receiveTimeType:2
        },
        op:{
	        pay: function() {
	        	if(o.control.paying){
	        		alert("订单处理中，请勿重复提交！");
	        		return;
	        	}
	        	var order = {
	        			serviceAddressId:o.model.address.id,
	        			memo:o.model.comment,
	        			receiveTimeType:o.model.receiveTimeType
	        	 }
	        	if(o.model.coupon != null) {
	        		order.couponId=o.model.coupon.id;
	        	};
	        	if(o.model.address.id==0){
	        		alert("请选择地址！");
	        		return;
	        	}
	        	createOrder(order);
	        },
	        showAddress:function(){
	        	o.control.currentPage='addrlist';
	        	chooseAddress(function(address){
                    if(address){
                        o.model.address=address;
                    }
                    o.control.currentPage='main';
                });
	        },
	        showCoupons:function(){
	        	o.control.currentPage='coupons';
	        },
	        storeMemo: function() {
	            o.model.comment = this.innerHTML;
	        },
	        focus: function() {
	            this.focus();
	        }
        },
        /** 选择送货日期 */
        datechoooser:{
        	time: '任何时间',
	        comment: '',
	        timePicker: [
	            {
	                name: '工作日',
	                value:0,
	                checked: false,
	            },
	            {
	                name: '节假日',
	                value:1,
	                checked: false
	            },
	            {
	                name: '任何时间',
	                value:2,
	                checked: true
	            }
	        ],
	        modalShown: false,
	        showModal: function() {
	            o.datechoooser.modalShown = true;
	        },
	        hideModal: function(e) {
	            if ('modal-mask' === e.target.className) {
	                o.datechoooser.modalShown = false;
	            }
	        },
	        selectTime: function(idx) {
	            for (var i = 0, len = o.datechoooser.timePicker.length; i < len; i++) {
	                o.datechoooser.timePicker[i].checked = false;
	            }
	            o.datechoooser.timePicker[idx].checked = true;
	            o.datechoooser.time = o.datechoooser.timePicker[idx].name;
	            o.model.receiveTimeType = o.datechoooser.timePicker[idx].value;
	            o.datechoooser.modalShown = false;
	        }
        }
    });

    avalon.scan(document.body);
    if(common.checkRegisterStatus()) {
    	queryBuyInfo();
    	queryCoupon();
    }
    getParam();
});