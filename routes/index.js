const express = require('express');
const router = express.Router();
const  { ensureAuthenticated } = require('../config/auth');
const Table = require("../models/Table");
const Menu = require("../models/Menu");
const Request = require('../models/requests')




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
  res.render("menueg.ejs");
});

//Menu post request
router.post('/dashboard/menu',ensureAuthenticated,(req, res)=>{
  var food = [];
  const userId=req.user._id;
  const userName = req.user.name;
  var variety = ["pizza","pasta","burger","macroni"];
  for(var i in req.body)
  {
    for(var j=0;j<variety.length;j++)
    {
      if(i==variety[j] && req.body[i+"Plates"]!='')
      {
        var ob = {
          name : i,
          cost : req.body[i],
          plates : req.body[i+"Plates"]
        }
        food.push(ob);
      }
    }
  } 
  
  const newMenu = new Menu({food:food,author:{id: userId,username: userName}});
  newMenu.save().then((menu)=>{
    var m = menu.food;
    var totCost = 0;
    for(var k in m)
    {
      totCost += ((Number)(m[k].cost)*(Number)(m[k].plates));
    }
    var tax = (18/100*totCost);
    totCost+=tax;
 //   console.log(totCost+"  "+tax);
  //  console.log(m);
   res.render("payment",{m,totCost,tax});
  }).catch(err => console.log(err));

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


router.post('/dashboard/confirmpayment',ensureAuthenticated,(req, res)=>{




  let errors=[];
  const card=req.body.card;
  const cvv=req.body.cvv;
  const expire=req.body.expire;
  const owner = req.body.owner;
  const amount=req.body.amount;

   var regex = new RegExp("^[0-9]{16}$");
   var cvvregex = new RegExp("^[0-9]{3}$");
   var dateregex = new RegExp("^[0-9]{2}/[0-9]{2}$");
    
   var month=parseInt(expire.substring(0,2));
   var year=parseInt(expire.substring(3));



    if (!regex.test(card))
      errors.push({msg:"Please enter the correct 16 digit card number"});

    
    if(!cvvregex.test(cvv))
      errors.push({msg:"Please enter the correct 3 digit CVV number"});
    
    if(!dateregex.test(expire))
    errors.push({msg:"Please enter the correct date"});

    if(year<19)
    errors.push({msg:"Card has already expired"});

    if(year==19 && month<11)
      errors.push({msg:"Card has already expired"});

   if(errors.length > 0)
      res.render("pay",{errors,amount});
});

//Payment
router.post('/dashboard/menu/payment',ensureAuthenticated,(req, res)=>{
  res.render("pay",{amount:req.body.amount});
});


//REnder contact page
router.get('/dashboard/contact',ensureAuthenticated,(req, res)=>{
  res.render("contact");
});

//post requests
router.post('/dashboard/contact',ensureAuthenticated,(req, res)=>{
  console.log(req.body);
    const name = req.body.fname + " " + req.body.lname;
    const userRequest = new Request({name:name,email:req.body.email,phone:req.body.phone});
    userRequest.save().then((r)=>{
      req.flash('success_msg', 'You have successfully submitted your request');
      res.redirect("/dashboard/contact");
    })
});

//About us page
router.get('/dashboard/about',ensureAuthenticated,(req, res)=>{
  res.render("about");
});

module.exports = router;