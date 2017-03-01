var testEntry = [
{
	name:'刘国平',
	page:window.location.search.replace(/((?!\/).+)\//,''),
	develop:true,		//开发中
	bugfix:false,		//修bug的时候
	jira:'-',			//like BP-123
	//以下两项判断是否需要跑测试用例
	day:'2.27',			//like 2.22
	close:true,		//手动关闭此入口
	tests:[
		{datas:[{name:'phone',text:'1'}]},
		{datas:[{name:'phone',text:'12'}]},
		{datas:[{name:'phone',text:'123'}]},
		{datas:[{name:'phone',text:'1234'}]},
		{datas:[{name:'phone',text:'13777778888'},{name:'password',text:'welcome1'}]},
	],
},
];
