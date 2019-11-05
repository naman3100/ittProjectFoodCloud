const express = require('express');
const router = express.Router();
const  { ensureAuthenticated } = require('../config/auth');
const Table = require("../models/Table");
const Menu = require("../models/Menu");
const Request = require('../models/requests')
const Feedback = require('../models/Feedback')
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Send Grid api for sending email
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('');

//Cook functionality
router.get('/cook/login',(req,res)=>{
  res.render("cookLogin")
})

//cook login
router.post('/cook/login',(req,res)=>{
  let errors= [];
  var name=req.body.name;
  var password =req.body.password;

  if(!(name=="1234567"))
  {
    errors.push({msg:"Only cooks are allowed to login"});
    return res.render("cookLogin",{errors});
  }

  if(!(password=="cook101"))
  {
      errors.push({msg:"Hey Cook you have entered a wrong password"});
      return res.render("adminLogin",{errors});
  }
  var data = [];
  var i=0;
  

  Menu.find({}, function(err, users) {
    

    users.forEach(function(user) {
      data[i++] = user;
    });
    //res.send(data)
    res.render("cook",{data});  
  });

 //console.log(User.find());

  //res.send("yo baby")
  
})


//Admin functionality
router.get('/admin/login',(req,res)=>{
  res.render("adminLogin")
})

//Admin login
router.post('/admin/login',(req,res)=>{
  let errors= [];
  var name=req.body.name;
  var password =req.body.password;

  if(!(name=="admin"))
  {
    errors.push({msg:"Only owner is allowed to login"});
    return res.render("adminLogin",{errors});
  }

  if(!(password=="foodcloud101"))
  {
      errors.push({msg:"Hey Adim, you have entered the wrong password"});
      return res.render("adminLogin",{errors});
  }

  res.render("adminPortal");
 
  
})

//Admin customers
router.get('/admin/customers',(req,res)=>{
  var data = [];
  var i=0;
  User.find({}, function(err, users) {
    

    users.forEach(function(user) {
      data[i++] = user;
    });

    res.render("customer",{data});  
  });

 //console.log(User.find());

 
})

//Admin feedback portal
router.get('/admin/feedback',(req,res)=>{
  var data = [];
  var i=0;
  Feedback.find({}, function(err, feedbacks) {
    

    feedbacks.forEach(function(feedback) {
      data[i++] = feedback;
    });

    res.render("adminFeedback",{data});  
  });

 //console.log(User.find());

 
})

//Admin view complains
router.get('/admin/complains',(req,res)=>{
  var data = [];
  var i=0;
  Request.find({}, function(err, requests) {
    

    requests.forEach(function(request) {
      data[i++] = request;
    });

    res.render("adminComplains",{data});  
  });

 //console.log(User.find());

 
})


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

 //Displaying bookings
 router.get('/dashboard/bookings',ensureAuthenticated,(req, res)=>{
    Table.find({author:{id:req.user._id,username:req.user.email}},(err,obj)=>{
      var data={};
      let errors=[];
      if(obj==null)
        {
          errors.push({msg:"You have not booked any table yet."});
        }

      if(errors.length > 0)
      {
        return res.render("booking",{errors,data});
      }
      data=obj;

      res.render("booking",{data});
    })
});

//Displaying orders
router.get('/dashboard/foodorder',ensureAuthenticated,(req, res)=>{
  Menu.find({author:{id:req.user._id,username:req.user.email}},(err,obj)=>{
    var data={};
    let errors=[];
    if(obj==null)
      {
        errors.push({msg:"You have not ordered any food yet"});
      }

    if(errors.length > 0)
    {
      return res.render("orders",{errors,data});
    }
    data=obj;

    res.render("orders",{data});
  })
});

 //Book Table post page (Saving table no)
 router.post('/dashboard/booktable',ensureAuthenticated,(req,res)=>{
   const {name, no , tnc} = req.body;
   const userId=req.user._id;
   const userName = req.user.email;
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
     // console.log(author);
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
        User.findOneAndUpdate({_id:req.user._id},{booking:{confirm:"1",tableno:no}}).then((y)=>console.log(y));

        

        //Flash message for booking successful
        req.flash('success_msg', 'You have successfully booked a table');
        res.redirect("/dashboard/booktable");
      }).catch(err => console.log(err));
    }
  } )
 });

 //Menu 
 router.get('/dashboard/menu',ensureAuthenticated,(req, res)=>{
  res.render("menu.ejs");
});

//Menu post request
router.post('/dashboard/menu',ensureAuthenticated,(req, res)=>{
  let errors=[];
  var food = [];
  const userId=req.user._id;
  const userName = req.user.email;
  var variety = ["Dragon Roll","Onion Rings","Fries","Burger","Pasta","Pizza","Spaghetti","Risotto","Noodles","Chopsuey","Cupcakes","Waffles","Pastry","Cannoli"];
  for(var i in req.body)
  {
    for(var j=0;j<variety.length;j++)
    {
      if(i==variety[j] && req.body[i+"plates"]!='')
      {
        var ob = {
          name : i,
          cost : req.body[i],
          plates : req.body[i+"plates"]
        }
        food.push(ob);
      }
    }
  } 

  if(food.length == 0)
    errors.push({msg:"You have not selected any item"});

  if(errors.length > 0)
    return res.render("menu",{errors});
  
  const newMenu = new Menu({food:food,author:{id: userId,username: userName}});
  newMenu.save().then((menu)=>{
    var m = menu.food;
    var totCost = 0;
    for(var k in m)
    {
      totCost += ((Number)(m[k].cost)*(Number)(m[k].plates));
    }
    var tax = Math.floor(18/100*totCost);
    totCost=Math.floor(totCost+tax);
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
  res.render("feedback");
});

router.post('/dashboard/feedback',ensureAuthenticated,(req, res)=>{
  const userId=req.user._id;
  const userName = req.user.name;
  const rating = req.body.feedback;
  const message= req.body.message;
  const newFeedback = new Feedback({review:{rating:rating,message:message},author:{id: userId,username: userName}});

  newFeedback.save().then((feedback)=>{
    res.render("successFeedback");
  })
});

//Privacy settings
router.get('/dashboard/setting',ensureAuthenticated,(req, res)=>{
  const name = req.user.name;
  const email = req.user.email;
  const mainAddress=req.user.address.mainAddress;
  const state=req.user.address.state;
  const zipcode = req.user.address.zipcode;
  const ph=req.user.ph;
  res.render("setting",{name,
    mainAddress,
    zipcode,
    ph,
    state,
    email});
});

//Post for settings
router.post('/dashboard/setting',ensureAuthenticated,(req, res)=>{
  const name = req.body.name;
  const mainAddress = req.body.mainAddress;
  const zipcode = req.body.zipcode;
  const state = req.body.state;
  const ph = req.body.ph;
 
  const email=req.body.email;
  var regex = new RegExp("^[0-9]{10}$");
  var regex1 = new RegExp("^[0-9]{6}$");
  let errors = [];
  
   

  

   if (ph!=null && !regex.test(ph))
   {
    console.log("ph check")
      errors.push({msg:"Please enter the correct 10 digit card number"});
   }
    if (zipcode!=null && !regex1.test(zipcode))
    {
      console.log("zipcode")
      errors.push({msg:"Please enter the correct 6 digit correct"});
    }
      // if(tc!="on")
      // {
      //   console.log("tc")
      //   errors.push({msg:"Please accept the terms and conditions"});
      // }
        if(errors.length > 0){
          res.render('setting', {
              errors,
              name,
              mainAddress,
              zipcode,
              state,
              ph,
              email
          })
      }
      else{

      //   const newUser = new User({
      //     name:name,
      //     password:password,
      //     address:{mainAddress,state,zipcode},
      //     ph:ph
      // });

    

     
      if(name!=null && name.length>0)
      {
        User.findOneAndUpdate({_id:req.user._id},{
          name:name
          // password:password,
          // address:{mainAddress,state,zipcode},
          // ph:ph
      }).then((user)=>{console.log("Updated successfully"+user)})
        .catch((err)=>{console.log("error")})  
      }


      if(mainAddress!=null && mainAddress.length>0)
      {
        User.findOneAndUpdate({_id:req.user._id},{
         
          address:{mainAddress,state,zipcode}
         
      }).then((user)=>{console.log("Updated successfully"+user)})
        .catch((err)=>{console.log("error")})
  
      }


      
        if(ph!=null && ph.length>0)
      {
      User.findOneAndUpdate({_id:req.user._id},{
       // name:name,
      //  password:password,
      //  address:{mainAddress,state,zipcode},
        ph:ph
    }).then((user)=>{console.log("Updated successfully"+user)})
      .catch((err)=>{console.log("error")})


     

      }

      
      return res.redirect("/dashboard");
    }
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

    if(month<0 || month>12)
      errors.push({msg:"Please enter the correct date"});

   if(errors.length > 0)
     return res.render("pay",{errors,amount});


  //sendgrid
  const msg = {
    to: req.user.email,
    from: 'reachnamanagarwal@gmail.com',
    subject: 'Order Placed Successfully',
 //   text: 'Hello! ' + newUser.name +' ! You have successfully registered. Enjoy dining.',
    html: '<strong>'+ 'Hello! ' + req.user.name +' ! You have successfully placed an order at food cloud. Enjoy dining.' +'</strong>'
  };
  sgMail.send(msg);

   res.render("confirm",{amount});
   
  
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