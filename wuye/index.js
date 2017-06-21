var page = 0;
avalon.ready(function() {
	function query(type){
        common.invokeApi("GET", "messages/"+page, null, null, function(n) {
			console.log(JSON.stringify(n));
			o.zixuns = n.result;
			page++;
		}, function() {
        })
	}
	function queryUserInfo(){
		common.invokeApi("GET","userInfo",null,null, function(n) {
			console.log(JSON.stringify(n));
			o.city=n.result.city;
			o.xiaoquName=n.result.xiaoquName;
		},function(){
		})
	}
	function getBannerType() {
        common.invokeApi("GET", "banner/3", null, null, function(n) {
            o.banners = n.result;
            initSwiper();
        }, function() {})
    }
    
    var a = 0,
    o = avalon.define({
        $id: "root",
       jumpToDetail:function(mid) {
    	   if(mid==15){
    		   window.location.href="http://mp.weixin.qq.com/s?__biz=MzA3Njk4ODgwMA==&mid=406333448&idx=1&sn=9b318dec9225d8fc1ce28b7a52007773#rd";
    	   }else if(mid==16){
    		   window.location.href="http://mp.weixin.qq.com/s?__biz=MzA3Njk4ODgwMA==&mid=407927486&idx=1&sn=c1f51214b1947b1b222af9a18e5593d6#rd";
    	   }else if(mid==17){
    		   window.location.href="http://mp.weixin.qq.com/s?__biz=MzA3Njk4ODgwMA==&mid=410063784&idx=1&sn=558b520c28f984ad7c0ed2a6ef692faf#rd";
       	   }else{
    		   window.location.href="message.html?messageId="+mid;
    	   }
       },
       banners:[],
       zixuns:[],
       city:"上海",
       xiaoquName:"友宜物业"
    });
    
    query();
    queryUserInfo();
    getBannerType();
    avalon.scan(document.body),
    FastClick.attach(document.body),
    common.setTitle("社区物业");
    initWechat(['onMenuShareTimeline','onMenuShareAppMessage']);
    initShareConfig("互帮、互助、分享的社区大家庭，尽在友宜物业邻里之家!",MasterConfig.C("basePageUrl")+"wuye/index.html?v=20160229",MasterConfig.C("basePageUrl")+"/static/images/share_logo3.png","邻里趣事，快来分享");
    checkFromShare();
    
});