avalon.ready(function() {
	function getOrderId(){
		o.orderId=getUrlParam("oId");
	}
    function getOrder() {
        var n = "GET",
        a = "getSupermarketOrder/"+o.orderId,
        i = null,
        e = function(n) {
            console.log(JSON.stringify(n));
            o.order = n.result;
            getOrderItems();
            
        },
        r = function(n) {
        	alert(n.message);
        	location.href="../home/index.html";
        };
        common.invokeApi(n, a, i, null, e, r)
    }
    
    function getOrderItems() {
        var n = "GET",
        a = "getSupermarketOrderItems/"+o.orderId,
        i = null,
        e = function(n) {
            console.log(JSON.stringify(n));
            o.orderItems = n.result;
            o.totalCount = o.orderItems.length;
            o.needPayPrice = parseFloat(o.order.totalAmount) - parseFloat(o.order.discountAmount);
            o.totalPrice = o.order.price;
//            o.totalPrice = o.totalPrice.toFixed(2);
            
        },
        r = function(n) {
        	alert(n.message);
        	location.href="../home/index.html";
        };
        common.invokeApi(n, a, i, null, e, r)
    }
    
    var o = avalon.define({
        $id: "root",
        orderId:"",
        order:{},
        orderItems:[],
        totalCount:0,
        needPayPrice:0,
        totalPrice:0,
        orderConfirm:function(order){
        	if(confirm("确定要发货吗？")){
        		function confirmOrder() {
        	        var n = "GET",
        	        a = "/supermarket/sendGoods/"+o.orderId,
        	        i = null,
        	        e = function(n) {
        	            console.log(JSON.stringify(n));
        	            alert("发货成功！");
        	            location.reload();
        	        },
        	        r = function(n) {
        	        	alert(n.message);
        	        };
        	        common.invokeApi(n, a, i, null, e, r)
        	    }
        		confirmOrder();
        	}
        }
    });

    
    
    getOrderId();
    getOrder();
    avalon.scan(document.body);
    //share.default_send();
    FastClick.attach(document.body);
	common.setTitle("订单详情");
});