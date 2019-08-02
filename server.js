const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const passport = require('passport');

const mongoose = require('mongoose');
const db = require('./config/keys.js').mongoURI;
mongoose.connect(db, { useNewUrlParser: true }).then(() => {
  console.log('connect mongodb');
}).catch(err => console.log(err))

//解析请求体中间件
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));// 解析 application/x-www-form-urlencoded
app.use(bodyParser.json());// 解析 application/json

// passport中间件
app.use(passport.initialize());
require('./config/passport')(passport);

//路由
const users = require('./routes/api/users');
app.use('/api/users', users);

//使用模板引擎
app.set('view engine', 'pug');

//根据判断环境，设置模板缓存
const env = process.env.NODE_ENV;
if ('production' === env) {
  app.enable('view cache');
}

//托管public下静态资源
app.use(express.static(__dirname + '/public'));

//路由
app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})