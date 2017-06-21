avalon.ready(function() {
	function getOrderId(){
		o.orderId=getUrlParam("orderId");
		o.type=getUrlParam("type");
		o.marketBuy = getUrlParam("marketBuy");
		
	}
	function notifyPaySuccess() {
		var url ="notifyPayed/"+o.orderId;
		if(o.marketBuy){
			url="/collocation/notifyPayed/"+o.orderId;
		}
        common.invokeApi("GET", url, null, null, function(n) {
    	}, function() {
    		
    	});
    }
	function initShareSetting(order){
		var title = order.productName;
		var link=MasterConfig.C('basePageUrl')+"group/onsalesindex.html";
		if(order.orderType==4){
			link=MasterConfig.C('basePageUrl')+"group/rgroupinvite.html?ruleId="+order.groupRuleId;
		}else if(order.orderType==0&&order.groupId!=0){
			link=MasterConfig.C('basePageUrl')+"group.html?groupId="+order.groupId;
		}
		if(o.marketBuy){
			link=MasterConfig.C('basePageUrl')+"home/index.html";
		}

		var desc="分享给小伙伴们一个超赞的限时特惠活动！";
		var img=order.productPic;
		if(order.seedStr!=null&&order.seedStr!=''){
			title = "友宜物业专享现金券";
			desc="分享给小伙伴们一个超赞的购物现金券！";
			img=MasterConfig.C('basePageUrl')+"static/images/coupon_share_icon.jpg"
			link=MasterConfig.C('basePageUrl')+"coupon.html?o="+order.seedStr;
		}
		initShareConfig(title,link,img,desc);
	}
    function query() {
        var n = "GET",
        a = "getOrder/"+o.orderId,
        i = null,
        e = function(n) {
			console.log(JSON.stringify(n));
            o.order = n.result;
            if(o.order == null || o.order.id == null){
            	if(confirm("获取订单信息失败")){
		        	if(o.type==4){
		        		location.href="rgroups.html";        		
		        	}else if(o.type==3){
		        		if(o.marketBuy){
		        			location.href="../home/index.html";
		        		}else{
		        			location.href="onsalesindex.html";
		        		}
		        	}else if(o.type==5){
		        		location.href="../home/index.html?v=20160229";
		        	}else{
		        		location.href="onsalesindex.html";     		
		        	}
    			}
            } else {
				initShareSetting(o.order);
			}
        },
        r = function() {
        	if(confirm("获取订单信息失败")){
		        	if(o.type==4){
		        		location.href="rgroups.html";        		
		        	}else if(o.type==3){
		        		if(o.marketBuy){
		        			location.href="../home/index.html";
		        		}else{
		        			location.href="onsalesindex.html";
		        		}
		        		
		        	}else if(o.type==5){
		        		location.href="../home/index.html?v=20160229";
		        	}else{
		        		location.href="onsalesindex.html";     		
		        	}
			};
        };
        common.invokeApi(n, a, i, null, e, r)
    }
    var o = avalon.define({
        $id: "root",
        order:{seedStr:""},
        orderId:"",
        coupon:{id:0},
        marketBuy: 0,
        goback:function(){
        	if(o.type==4){
        		location.href="rgroups.html";
        	}else if(o.type==3){
        		if(o.marketBuy){
        			location.href="../home/index.html";
        		}else{
        			location.href="onsalesindex.html";
        		}
        	}else if(o.type==5){
        		location.href="../home/index.html?v=20160229";
        	}else{
        		location.href="onsalesindex.html";
        	}
        }
    });
    getOrderId();
    notifyPaySuccess();
    query();
    initWechat(['onMenuShareTimeline','onMenuShareAppMessage']);
    
    avalon.scan(document.body);
});