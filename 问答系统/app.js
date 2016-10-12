const express = require('express');

const bodyParser = require('body-parser');

const multer = require('multer');

const fs = require('fs');
const app = express();
const form = multer();
app.use(express.static('www'));

var storage = multer.diskStorage({
    // cb 回调函数 callback
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        // file原始上传图片相关信息的对象
        console.log(file)
        // cb 第二个参数：上传到服务器上的名字
        cb(null, file.originalname)
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
    req.body.ip =req.ip;
    req.body.time = new Date().getTime();
    var user = req.body;
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

// 提交问题
//app.post('/Jqask', function () {
//
//})

// 上传图片
app.post('/JqPhoto', upload.single('photo'), function (req, res) {
    console.log(req.body);
})

app.listen(3000, function(){
  console.log('服务器正常起动');
})
