const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    booking:{
        confirm:{
            type:String
        },
        tableno:{
            type:String
        }
    },
    address:{
        mainAddress:{
            type:String
        },
        state:{
            type:String
        },
        zipcode:{
            type:String
        }
    },
    ph:{
        type:String
    }
});

const User = mongoose.model('User' , UserSchema);

module.exports = User;