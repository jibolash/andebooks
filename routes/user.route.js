'use strict';
var express = require('express');
var userRouter = express.Router();

//authentication
var jwt =require('jsonwebtoken');
var superSecret = 'andebookswebapplication';

var user = require('../controllers/user.controller');

module.exports = function(app){

  userRouter.post('/authenticate', user.authenticateUser);

  //middleware in charge of all user requests
  userRouter.use(function(req, res, next){
    //check post parameters for token
    var token = req.headers['x-access-token'];

    //if there is a token, decode it
    if(token){
      jwt.verify(token, superSecret, function(err, decoded){
        if(err){
          res.json({
            message: 'Token could not be authenticated'
          });
        }
        else{
          req.decoded = decoded;
          //console.log(req.decoded);
          next();
        }
      });
    }else{
      return res.status(403).json({
        message: 'Token not found'
      });
    }
  });

  userRouter.route('/users')
    .get(user.getUsers)
    .post(user.addUser);

  userRouter.route('/user/:user_id')
    .get(user.getOneUser)
    .put(user.updateUser)
    .delete(user.deleteUser);

  userRouter.get('/me', function(req, res){
    res.send(req.decoded);
  });

  app.use('/api', userRouter);
};