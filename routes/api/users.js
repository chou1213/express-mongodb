const express = require('express');
const router = express.Router();
const Users = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// 注册
router.post('/register', (req, res) => {
  //查询数据库
  Users.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.status(400).json({ msg: '邮箱已被注册' });
    } else {
      const newUser = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      //加密
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          if (err) {
            throw err;
          } else {
            newUser.password = hash;
            //插入一条数据
            newUser.save().then(user => res.json(user)).catch(err => console.log(err));
          }
        });
      });
    }
  })

});

//登陆
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  //查数据
  Users.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ msg: '用户不存在' });
    } else {
      //匹配密码
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //jwt授权
          jwt.sign({
            id: user.id,
            name: user.name
          }, 'secret', { expiresIn: 3600 }, (err, token) => {
            if (err) {
              throw err;
            } else {
              res.json({
                msg: 'success',
                token: `Bearer ${token}`
              })
            }
          });
        } else {
          next(1);
          // return res.status(400).json({ msg: '密码错误' });
        }
      })
    }
  })
})

//获取用户信息
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    msg: '成功',
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  })
})

module.exports = router;