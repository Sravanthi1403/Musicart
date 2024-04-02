const mongoose = require('mongoose');


const feedbackSchema = new mongoose.Schema({
    username: {
      type: String,
      ref:'User'
    },
    feedbackType: {
        type: String,
        enum: ["Bugs", "Feedback", "Query"],
        default: "Feedback",
        required: true
    },
    feedbackData: {
      type: String,
      required: true
    }
  });

const Feedback = new mongoose.model("Feedback", feedbackSchema)

module.exports = Feedback;