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
        cb(null, 'www/uploads')
    },
    filename: function (req, file, cb) {
        // 在req加入一个属性file，等于一个file对象
        req.file = file;
        var name = req.cookies.user;

        var arr = file.originalname.lastIndexOf('.');
        // slice() 可从已有的数组中返回选定的元素规定从何处开始选取
        var str1 = file.originalname.slice(arr);
        // file原始上传图片相关信息的对象
        console.log(file)
        if (file.mimetype == 'image/jpeg') {
            cb(null, name + str1);
        } else {
            console.log('不正确');
        }

    }
})

var upload = multer({ storage: storage })

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    console.log('这是根目录');
})

// 注册页面
app.post('/jqpost', function (req, res) {
    console.log('服务器连通');
    function formatIp(ip) {
        ip = ip == "::1" ? "192.168.0.1" : req.ip;
        if ((ip).startsWith('::ffff:')) {
            ip = ip.substring(7);
            return ip;
        }
    }

    req.body.ip = formatIp(req.ip);
    console.log(req.body.ip);
    var date = new Date()
    req.body.time = date.toLocaleDateString() + " " + date.toLocaleTimeString();
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
    function readFiles(i,files){

    }
    var questions = []
    var obj = [];
    fs.readdir('questions', function (err, files) {
//        console.log(files);
        if (!err) {
            // 排序
            files.reverse();
            // 玄幻读取文件里的内容，加入questions数组中
            files.forEach(function (file) {
                fs.readFile('questions/' + file, function (err, data) {
                    var str = data.toString().trim();
                    console.log(file);
                    obj = JSON.parse(str);
                    questions.push(obj);
                    if(questions.length==files.length){
                        console.log(questions)
                        res.status(200).json({code:'success',data:questions});
                    }
                })
            });
        } else {

        }
    })
})

// 提交问题
app.post('/Jqask', function (req, res) {
    var date = new Date()
//    req.body.time = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    var ask = req.body.ask;
    req.body.time=date.getTime();
    var reg1 = /</mg;
    var reg2 = />/mg;
    ask = ask.replace(reg1, '&lt;');
    ask = ask.replace(reg2, '&gt;');
    var user = req.body;
    console.log(user);
    var userStr = JSON.stringify(user);
    fs.appendFile('questions/' + date.getTime() + '.txt', userStr, function (err) {
        res.status(200).send('aaa');
        console.log('成功');
    })
})

// 提交回答
app.post('/Jqanswer', function (req, res) {
    var date = new Date();
    req.body.time = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    var answer = req.body.answer;
    var reg1 = /</mg;
    var reg2 = />/mg;
    answer = answer.replace(reg1, '&lt;');
    answer = answer.replace(reg2, '&gt;');
    var user = req.body;
    var userStr = JSON.stringify(user);
    console.log(user)
    fs.readFile('questions/'+user.question+'.txt',function(err,data){
        var arr = data.toString().trim();
        // 问题的对象
        var askObj = JSON.parse(arr);
        console.log(askObj)

        if((typeof (askObj.user))=='object'){
            askObj.user.push(user);
        }else{
            askObj.user =[];
            askObj.user.push(user);
        }
        console.log(typeof (askObj.user));
        console.log(askObj.user);
        fs.writeFile('questions/'+user.question+'.txt', JSON.stringify(askObj),function (err, data) {
            res.status(200).send('成功');
        })
    })
})

// 上传图片
app.post('/JqPhoto', upload.single('photo'), function (req, res) {
    if (req.file.mimetype == 'image/jpeg') {
        res.status(200).send('成功')
    } else {
        res.status(200).send('失败')
    }
    console.log(req.body);

})

app.listen(3000, function () {
    console.log('服务器正常起动');
})
