const mongoose = require("mongoose");


const MenuSchema = new mongoose.Schema({
    food :[{
        name:{
            type:String
        },
        cost:{
            type:Number
        }
    }],
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     },
     expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '10m' },
      },
     date:{
        type:Date,
        default:Date.now
    }
});

const Menu = mongoose.model("Menu" , MenuSchema);

module.exports = Menu;