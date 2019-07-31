const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Users = require('../models/User');
const keys = require('../config/keys');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    //获取jwt.sign，playload定义的json
    console.log(jwt_payload);
    Users.findById(jwt_payload.id).then(user => {
      console.log(user)
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    }).catch(err => {
      console.log(err);
    })
  }));
}