const express = require('express');

const bodyParser = require('body-parser');

const multer = require('multer');

const fs = require('fs');
const app = express();
const form = multer();
const cookieParser = require("cookie-parser");
app.use(cookieParser())
app.use(express.static('www'));

// 上传图片
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        // 在req加入一个属性file，等于一个file对象
        req.file = file;
        var arr = file.originalname.lastIndexOf('.');
        // slice() 可从已有的数组中返回选定的元素规定从何处开始选取
        var str1 = file.originalname.slice(arr);
        console.log(arr);
        var name = req.cookies.user;
        console.log(req.cookies.user);
        // file原始上传图片相关信息的对象
        console.log(file)
        if(file.mimetype=='image/jpeg'){
            cb(null, name+str1);
        }else{
            console.log('不正确');
        }

    }
})

var upload = multer({ storage: storage })

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res){
  console.log('这是根目录');
})

// 注册页面
app.post('/jqpost', function (req, res) {
    console.log('服务器连通');
    function formatIp(ip) {
        ip=ip=="::1"?"192.168.0.1":req.ip;
        if((ip).startsWith('::ffff:')){
            ip = ip.substring(7);
            return ip;
        }
    }
    req.body.ip =formatIp(req.ip);
    console.log(req.body.ip);
    var date = new Date()
    req.body.time = date.toLocaleDateString()+" " + date.toLocaleTimeString();
    var user = {};
    user.name = req.body.name;
    user.password = req.body.password;
    user.sex = req.body.sex;
    user.email = req.body.email;
    user.course = req.body.course;
    user.ip = req.body.ip;
    user.time = req.body.time;
    var userStr = JSON.stringify(user);
    fs.readFile('user.txt', function (err, data) {
        var usersStr = data.toString().trim();
        var userArr = JSON.parse('[' + usersStr + ']')
        var isIn = false;
        userArr.forEach(function (ele, ind) {
            if (user.name == ele.name) {
                isIn = true;
            }
        });
        if (isIn) {
            res.status(200).send('错误')
        } else {
            var douhao = usersStr.length > 0 ? ',' : '';
            fs.appendFile('user.txt', douhao + userStr, function (err) {
                if (err) {
                    res.status(200).send('错误')
                } else {
                    res.status(200).send('<p style="color:green">恭喜你' + ' ' + req.body.account + ' ' + '注册成功</p>')
                }
            })
        }
    })
})

// 登录页面
app.post('/Jqindex/post', function (req, res) {
    console.log('服务器连通')
    var user = req.body;

    fs.readFile('user.txt', function (err, data) {
        var str = data.toString().trim();
        var obj = JSON.parse('[' + str + ']');
        console.log(obj);
        var isIn = obj.some(function (ele, ind, arr) {
            return (user.name == ele.name && user.password == ele.password)
        })
        if (isIn) {
            res.status(200).send('<p style="color:green">登陆成功</p>')
        } else {
            res.status(200).send('错误')
        }
    })
})

// 主页读取问题
app.post('/Jqindex/ask', function (req, res) {
//    fs.readFile('messages.txt', function (err, data) {
//        var ask = data.toString().trim();
//        var askStr = JSON.parse('[' + ask + ']')
//        console.log(askStr);
//        res.status(200).send(askStr)
//    })
    fs.readdir('questions',function(err,files){
        console.log('问答文件夹文件：'+files);
        var arr = (files.toString().trim()).split(',');
        console.log(arr);
        for(var i in arr){
            console.log('questions/'+arr[i]);
            fs.readFile('questions/'+arr[i], function (err, data) {
                var str = data.toString().trim();
                console.log('这是文件'+str);
            })
        }
    })
})

// 提交问题
app.post('/Jqask', function (req,res) {
    var date = new Date()
    req.body.time = date.toLocaleDateString()+" " + date.toLocaleTimeString();
    var ask = req.body.ask;
    var reg1 = /</mg;
    var reg2 = />/mg;
    ask = ask.replace(reg1,'&lt;');
    ask = ask.replace(reg2,'&gt;');
    var user = req.body;
    console.log(user);
    var userStr = JSON.stringify(user);
        fs.appendFile('questions/'+date.getTime()+'.txt',userStr, function (err) {
            res.status(200).send('aaa');
            console.log('成功');
        })
})

// 提交回答
app.post('/Jqanswer', function (req, res) {
    var date = new Date();
    req.body.time = date.toLocaleDateString()+' '+date.toLocaleTimeString();
    var answer = req.body.answer;
    var reg1 = /</mg;
    var reg2 = />/mg;
    answer = answer.replace(reg1,'&lt;');
    answer = answer.replace(reg2,'&gt;');
    var user = req.body;
    var userStr = JSON.stringify(user);
//    console.log(userStr);
    res.status(200).send('nihao')
    var usersStr = JSON.parse('['+userStr+']');
    console.log(usersStr)
})

// 上传图片
app.post('/JqPhoto', upload.single('photo'), function (req, res) {
    console.log('成功')
    console.log(req.body);
    res.status(200).send('成功')
})

app.listen(3000, function(){
  console.log('服务器正常起动');
})
