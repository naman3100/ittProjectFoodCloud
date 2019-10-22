const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    no : {
        type:String,
        required:true
    },
    booking : {
        type:Boolean
    },
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     }
});

const Table = mongoose.model("Table" , TableSchema);

module.exports = Table;