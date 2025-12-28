const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { ErrorHandler } = require('../utils/ErrorHandler');


// const isAuthenticated = async (req, res, next) =>{
//     try {
//         // console.log(req.cookies.accessToken)
//         const {token} = req.cookies 
        
//         if(!token) {
//             return next(new ErrorHandler(401, 'Unauthorized request'));
//         }

//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

//         const user = await User.findById(decodedToken?._id).select("-password")

//         if(!user){
//             return next(new ErrorHandler(401, "Invalid Token"))
//         }

//         req.user = user;
//         next()

//     } catch (error) {
//         return next(new ErrorHandler(500, 'Internal Server Error')); 
//     }
// }
const isAuthenticated = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);

    const { token } = req.cookies;

    if (!token) {
      console.log("❌ Token missing");
      return next(new ErrorHandler(401, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decodedToken);

    const user = await User.findById(decodedToken._id).select("-password");

    console.log("Authenticated user:", user);

    if (!user) {
      return next(new ErrorHandler(401, "Invalid token"));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("🔥 AUTH ERROR:", error);
    return next(new ErrorHandler(500, "Internal Server Error"));
  }
};


module.exports = isAuthenticated