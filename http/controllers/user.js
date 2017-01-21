var express = require('express');
var app = express();
var router = express.Router();
var User = require('../../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config/token');
var auth = require('../middleware/auth');

router.get('/check-state', auth.verifyToken, (req, res) => {

  let content = {
    success: true,
    message: 'Successfully logged in'
  }
  res.send(content);

});

router.post('/register', (req, res) => {

  var reqUser = req.body;

  process.nextTick( () => {
    User.findOne({ 'email': reqUser.email }, (err, user) => {
      if(err)
        return done(err);
      
      if(user){
        let content = {
          success: false,
          message: 'user already exists'
        };
        res.send(content);
        return;
      } else {
        var newUser = new User();
        newUser.email = reqUser.email;
        newUser.password = newUser.generateHash(reqUser.password);
        newUser.save( (err) => {
            if( err )
                throw err;

            let token = jwt.sign(newUser, config.secret, {
              expiresIn : 60*60*24
            });
            let content = {
              user: newUser,
              success: true,
              message: 'You created a new user',
              token: token
            };
            res.send(content);
            return;
        })
      }
    })
  })
});

router.post('/login', (req, res) => {

  var reqUser = req.body;

  User.findOne({'email' : reqUser.email}, (err, user) => {

    if( err )
      return done(err);

    if( !user ) {
      let content = {
        success: false,
        message: 'User does not exists'
      };
      res.send(content);
      return;
    }

    if( !user.validPassword(reqUser.password) ){
      let content = {
        success: false,
        message: 'Incorrect password'
      };
      res.send(content);
      return;
    }

    let token = jwt.sign(user, config.secret, {
      expiresIn : 60*60*24
    });
    let content = {
      user: user,
      success: true,
      message: 'You logged in',
      token: token
    };
    res.send(content);

  })

});

module.exports = router;
