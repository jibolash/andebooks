'use strict';
var express = require('express');
var userRouter = express.Router();

//authentication
var jwt =require('jsonwebtoken');
var superSecret = 'andebookswebapplication';

var user = require('../controllers/user.controller');

module.exports = function(app){

  userRouter.post('/authenticate', user.authenticateUser);

  userRouter.route('/users')
    .get(user.getUsers)
    .post(user.addUser);

  userRouter.route('/user/:user_id')
    .get(user.getOneUser)
    .put(user.verifyToken, user.updateUser)
    .delete(user.verifyToken, user.deleteUser);

  userRouter.get('/me', function(req, res){
    res.send(req.decoded);
  });

  app.use('/api', userRouter);
};
