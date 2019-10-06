var express = require("express");
var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require ('express-session');
const passport = require('passport');

const app = express();

// Passport cofig
require('./config/passport')(passport);

//connect to mongo
mongoose.connect('mongodb://127.0.0.1:27017/itt-project', {
useNewUrlParser: true,
useCreateIndex: true
})
.then(()=>{console.log('MOngoDb connected...')})
.catch((err)=>{console.log(err)});

// EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Body parser
app.use(express.urlencoded({extended:false}));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const port = process.env.PORT ||  5000;

app.listen(port, console.log(`Server started on port ${port}`));
