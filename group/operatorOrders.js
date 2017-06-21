avalon.ready(function() {
    function query() {
        var n = "GET",
        a = "orders/status/supermarket/"+o.currentStatus,
        i = null,
        e = function(n) {
			console.log(JSON.stringify(n));
            o.orders = n.result;
           
        },
        r = function() {
			console.log(JSON.stringify(n));
			o.orders = [];
        };
        common.invokeApi(n, a, i, null, e, r)
    }
    
    function orderConfirm(idx) {
    	var n = "GET",
        a = "/signOrder/"+o.orders[idx].id,
        i = null,
        e = function(n) {
    		o.orders[idx].status=6;
    		o.orders[idx].statusStr="已签收";
        },
        r = function() {
			alert("支付签收失败，请稍后重试！");
        };
        common.invokeApi(n, a, i, null, e, r)
    }
    var o = avalon.define({
        $id: "root",
        orders: [],
        currentStatus:'NEEDSEND',
        groupsNum: 1,
        bg_img:'static/img/bg/bg_orders.jpg',
        dropdownCollapsed: true,
        selectedDropdown: '',
        dropdowns: [
            {
                name: '待发货',
                value: 'PREPARE'//根据需要传给后台的查询参数修改这些value
            },
            
            {
                name: '已发货',
                value: 'FINISHED'//根据需要传给后台的查询参数修改这些value
            }
        ],
        toggleDropdown: function() {
            o.dropdownCollapsed = !o.dropdownCollapsed;
        },
        selectDropdown: function(idx) {
            o.selectedDropdown = o.dropdowns[idx];
            if(o.currentStatus!=o.selectedDropdown.value){
            	o.currentStatus=o.selectedDropdown.value;
            	query();
            }
            //根据选择的筛选条件刷新列表数据
        },
        show:function(page) {
        	o.currentShow = page
        },
        gotoDetail:function(orderid){
        	location.href="smorderdetail.html?oId="+orderid;
	},
    checkLogisics: function(order){
    	var  logisticName = escape(order.logisticName);
		location.href = "logistics.html?com=" + logisticName+"&nu="+order.logisticNo; 
    }
    });
    query(),
    avalon.scan(document.body),
    //share.default_send(),
    FastClick.attach(document.body),
    common.setTitle("商品订单");
});