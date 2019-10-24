const express = require('express');
const router = express.Router();
const  { ensureAuthenticated } = require('../config/auth');
const Table = require("../models/Table");
// Welcome Page
router.get('/',(req, res)=> res.render('welcome'));

// Dashboard
router.get('/dashboard',ensureAuthenticated ,(req, res)=>
 res.render('dash',{
   name : req.user.name  
 })
 );

 //Book Table render page (Get Page)
 router.get('/dashboard/booktable',ensureAuthenticated,(req, res)=>{
   res.render('table');
 });

 //Book Table post page (Saving table no)
 router.post('/dashboard/booktable',ensureAuthenticated,(req,res)=>{
   const {name, no , tnc} = req.body;
   const userId=req.user._id;
   const userName = req.user.name;
  //  console.log(userName,"  ",userId);
  //  console.log(name);
  //  console.log(no);
  //  console.log(tnc);
  const errors= [];
  Table.findOne({name:name}).
  then((table)=>{
    if(tnc!="on")
    {
      errors.push({msg:"Please accept the terms and conditions"});
      return res.render("table",{errors});
    } 
    else if(!table)
    {
      const author = {userId,userName};
      console.log(author);
      const newTable = new Table({name, no, booking:true,author:{id: userId,username: userName}});
      newTable.save().then((table)=>{
        req.flash('success_msg', 'You have successfully booked a table');
        res.redirect("/dashboard/booktable");
      })
    }
    if(table.booking==true)
    {
      //Table is already taken
      errors.push({msg:"Table is alredy taken, Please select another one"});
      return res.render("table",{errors});
    } 
    else{
      table.booking=true;
      table.no=no;
      table.author={id: userId,username: userName};
      table.save().then(t=>{
        
        //User booking table
        req.user.booking.confirm=true;
        req.user.booking.tableno=no;

        req.user.save().then((user)=>console.log("User booking confirmed"));

        //Flash message for booking successful
        req.flash('success_msg', 'You have successfully booked a table');
        res.redirect("/dashboard/booktable");
      }).catch(err => console.log(err));
    }
  } )
 });

 //Menu 
 router.get('/dashboard/menu',ensureAuthenticated,(req, res)=>{
  res.render("menu");
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