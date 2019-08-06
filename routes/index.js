var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));

router.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//处理post请求
router.post('/upload', function(req, res) {
	console.log(req.body);
	console.log(req.param());
	console.log(JSON.parse(req.body.data));
	
	var fs = require("fs");//申请文件处理
	var rawdata = JSON.parse(req.body.data);//获取request的参数
	//console.log(typeof(rawdata));
	var i = 0;
	var testdata = "";//输入字符串
	for (i = 0; i < rawdata.length; i++) {//生成string字符串导入txt文件
		testdata += "id: " + rawdata[i].id + "\ncurrent_time: " + rawdata[i].cur_Time + "\ncurrent_action: " + rawdata[i].cur_action + "\nskip_time: " + rawdata[i].skip_time + "\n";
		console.log(testdata);
	}
	var filepath = "output.txt";//文件路径
	fs.writeFile(filepath, testdata, function(err){//写入内容到txt文件
		if (err) {
			console.log(err);
		} else {
			console.log('success');
		}
	});
	res.send('test');//回复请求
});

module.exports = router;
