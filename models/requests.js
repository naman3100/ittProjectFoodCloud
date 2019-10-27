
const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    phone:{
        type:String
    },
     date:{
        type:Date,
        default:Date.now
    }
});

const Request = mongoose.model("Request" , RequestSchema);

module.exports = Request;