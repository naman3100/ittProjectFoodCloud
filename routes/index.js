const express = require('express');
const router = express.Router();
const  { ensureAuthenticated } = require('../config/auth');
// Welcome Page
router.get('/',(req, res)=> res.render('welcome'));

// Dashboard
router.get('/dashboard',ensureAuthenticated ,(req, res)=>
 res.render('dashboard',{
   name : req.user.name  
 })
 );

 //Book Table
 router.get('/dashboard/booktable',ensureAuthenticated,(req, res)=>{
   res.send("Book Table works");
 });

 //Order food
 router.get('/dashboard/orderfood',ensureAuthenticated,(req, res)=>{
  res.send("Order food works");
});

//Check Order status
router.get('/dashboard/status',ensureAuthenticated,(req, res)=>{
  res.send("Checking status");
});

//Service feedback and tip
router.get('/dashboard/feedback',ensureAuthenticated,(req, res)=>{
  res.send("Feedback works");
});

//Privacy settings
router.get('/dashboard/setting',ensureAuthenticated,(req, res)=>{
  res.send("Settinhs works");
});

//Payment
router.get('/dashboard/payment',ensureAuthenticated,(req, res)=>{
  res.send("Payment works");
});


module.exports = router;