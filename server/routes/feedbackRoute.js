const express = require('express');
const router = express.Router();
const feedbackControllers = require('../controllers/feedbackController');

router.route('/').post(feedbackControllers.userFeedback);

module.exports = router;