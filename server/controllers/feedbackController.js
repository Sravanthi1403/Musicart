const Feedback = require('../models/feedbackModel');
const { ErrorHandler } = require('../utils/ErrorHandler');

const userFeedback = async (req, res, next) => {
    try {
      const { username, feedbackType, feedbackMessageRef  } = req.body;
      const feedback = new Feedback({
        username,
        feedbackType,
        feedbackData:feedbackMessageRef,
      });
      await feedback.save();
      res.status(201).json({ message: 'Feedback sent successfully!' });
    } catch (error) {
      console.error('Error sending feedback:', error);
      return next(new ErrorHandler(500,'Internal server error'));
    }
  };
  
  module.exports = {userFeedback };
