const jwt = require('jsonwebtoken')

const setCookie = (res, user_id, statusCode, message) => {
    const token = jwt.sign({_id : user_id}, process.env.JWT_SECRET)

    res.cookie("token", token, {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
  secure: true
});

res.status(statusCode).json({
  success: true,
  message
});

}

module.exports = setCookie