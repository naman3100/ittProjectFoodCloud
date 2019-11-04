const mongoose = require("mongoose");


const FeedbackSchema = new mongoose.Schema({
    review:{
        rating:{
            type:String
        },
        message:{
            type:String
        }
    },
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     },
     date:{
        type:Date,
        default:Date.now
    }
});

const Feedback = mongoose.model("Feedback" , FeedbackSchema);

module.exports = Feedback;