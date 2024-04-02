const User = require('../models/userModel');
const { ErrorHandler } = require('../utils/ErrorHandler');
const setCookie = require('../utils/cookie');

// *------------------------
// USER SIGNUP LOGIC
// *-------------------------

const signupUser = async (req,res,next) =>{
    try {
        console.log('from register', req.body);
        const {username,phone,email,password}= req.body;

        const existedUser = await User.findOne({
            $or: [{ phone },{ email }]
        });

        if(existedUser){
            return next(new ErrorHandler(409, "User Already Exists"));
        } 

        const user = await User.create({
            username,
            phone,
            email,
            password,
        });

        const createdUser = await User.findById(user._id).select("-password")

        if(!createdUser){
            return next(new ErrorHandler(500, 'Something went wrong  while registering the user'));
        }

        const words = createdUser.username.split(' ');
        const UserFirstName = words.slice(0, 1).join(' ');

        // setting cookie
        return setCookie(res, createdUser._id, 201, `Welcome ${UserFirstName}`)
    } catch (error) {
        console.log(error.message)
        return next(new ErrorHandler(500, 'Internal Server Error'));
    }
};
// *------------------------
// USER LOGIN LOGIC
// *-------------------------

const loginUser = async (req,res,next) =>{
    try {
        console.log('from login', req.body);
        const { PhoneOrEmail, password } = req.body;

        // Determine if PhoneOrEmail is a phone number or an email address
        const isPhone = /^\d+$/.test(PhoneOrEmail); 

        let user;
        if (isPhone) {
            user = await User.findOne({ phone: PhoneOrEmail });
        } else {
            user = await User.findOne({ email: PhoneOrEmail });
        }

        if(!user){
            return next(new ErrorHandler(404, "User does not exist"));
        }

        // compare password
        const isPasswordMatch = await user.comparePassword(password);
        console.log("user from login ",user);

        if(!isPasswordMatch){
            return next(new ErrorHandler(401, 'Invalid user credentials'));
        }

        const loggedInUser = await User.findById(user._id).select("-password")

        const words = loggedInUser.username.split(' ');
        const UserFirstName = words.slice(0, 1).join(' ');

        return setCookie(res, user._id, 200, `Welcome ${UserFirstName}`)
    } catch (error) {
        console.log(error.message);
        return next(new ErrorHandler(500, 'Internal Server Error'));
    }

}

// *------------------------
// USER LOGOUT LOGIC
// *-------------------------


const logoutUser = async (req,res) =>{
    // deleting token
    try {
        res.status(200).cookie("token", "", {expires : new Date(Date.now()), 
        sameSite : "none", 
        secure :  true
    }).json({
            success : true,
            message : "logged out"
        })
    } catch (error) {
        console.log(error.message)
        return next(new ErrorHandler('Internal Server Error', 500));
    }
}

// *-----------------------------
// GET USER DATA
// *------------------------------

const userProfile = async (req, res) =>{
    try {
        const userData = req.user;
        console.log(userData);
        if (!userData) {
            return next(new errorMiddleware(404, "User data not found"));
        }
        return res.status(200).json(
            {
                success:true,
                userData
            });
    } catch (error) {
        console.error( `Error from the user data route ${error}`);
        return next(new ErrorHandler(500, 'Internal Server Error'));
    }
}


module.exports = {signupUser, loginUser, logoutUser, userProfile};



// const User = require('../models/userModel');
// const { ErrorHandler } = require('../utils/ErrorHandler');
// const jwt = require('jsonwebtoken');

// const generateAccessAndRefreshTokens = async(userId) => {
//     try {
//         const user = await User.findById(userId)
//         const accessToken = user.generateAccessToken()
//         const refreshToken = user.generateRefreshToken()

//         user.refreshToken = refreshToken
//         await user.save({ validateBeforeSave: false })

//         return {accessToken, refreshToken}

//     } catch (error) {
//         return next(new ErrorHandler(500, 'Internal Server Error')); 
//     }
// }

// // *------------------------
// // USER SIGNUP LOGIC
// // *-------------------------

// const signupUser = async (req,res,next) =>{
//     try {
//         console.log('from register', req.body);
//         const {username,phone,email,password}= req.body;

//         const existedUser = await User.findOne({
//             $or: [{ phone },{ email }]
//         });

//         if(existedUser){
//             return next(new ErrorHandler(409, "User Already Exists"));
//         } 

//         const user = await User.create({
//             username,
//             phone,
//             email,
//             password,
//         });

//         const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

//         const createdUser = await User.findById(user._id).select("-password -refreshToken")

//         if(!createdUser){
//             return next(new ErrorHandler(500, 'Something went wrong  while registering the user'));
//         }

//         const words = createdUser.username.split(' ');
//         const UserFirstName = words.slice(0, 1).join(' ');

//         const options = {
//             httpOnly: true,
//             secure: true,
//         }

//         res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json({
//             success: true,
//             message : `Welcome ${UserFirstName}`,
//             userId:createdUser._id,
//             user: createdUser,accessToken,refreshToken,
//         });
//     } catch (error) {
//         console.log(error.message)
//         return next(new ErrorHandler(500, 'Internal Server Error'));
//     }
// };
// // *------------------------
// // USER LOGIN LOGIC
// // *-------------------------

// const loginUser = async (req,res,next) =>{
//     try {
//         console.log('from login', req.body);
//         const { PhoneOrEmail, password } = req.body;

//         // Determine if PhoneOrEmail is a phone number or an email address
//         const isPhone = /^\d+$/.test(PhoneOrEmail); 

//         let user;
//         if (isPhone) {
//             user = await User.findOne({ phone: PhoneOrEmail });
//         } else {
//             user = await User.findOne({ email: PhoneOrEmail });
//         }

//         if(!user){
//             return next(new ErrorHandler(404, "User does not exist"));
//         }

//         // compare password
//         const isPasswordMatch = await user.comparePassword(password);
//         console.log("user from login ",user);

//         if(!isPasswordMatch){
//             return next(new ErrorHandler(401, 'Invalid user credentials'));
//         }

//         const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

//         const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//         const words = loggedInUser.username.split(' ');
//         const UserFirstName = words.slice(0, 1).join(' ');

//         const options = {
//             httpOnly: true,
//             secure: true,
//         }

//         return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json({
//             success: true,
//             message : `Welcome ${UserFirstName}`,
//             userId:loggedInUser._id,
//             user: loggedInUser,accessToken,refreshToken,
//         });
//     } catch (error) {
//         console.log(error.message);
//         return next(new ErrorHandler(500, 'Internal Server Error'));
//     }

// }

// // *------------------------
// // USER LOGOUT LOGIC
// // *-------------------------


// const logoutUser = async (req,res) =>{
//     try {
//         await User.findByIdAndUpdate(
//             req.user._id,
//             {
//                 $set:{
//                     refreshToken: undefined
//                 }
//             },
//             {
//                 new: true
//             }
//         )

//         const options = {
//             httpOnly:true,
//             secure:true,
//         }

//         return res
//         .status(200)
//         .clearCookie("accessToken", options)
//         .clearCookie("refreshToken", options)
//         .json(
//             {
//                 success : true,
//                 message : "logged out"
//             }
//         )
        
//     } catch (error) {
//         console.log(error.message);
//         return next(new ErrorHandler(500, 'Internal Server Error'));
//     }
// }

// // *------------------------
// // REFRESH ACCESS TOKEN
// // *-------------------------

// const refreshAccessToken = async (req, res) =>{
//     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
//     if(!incomingRefreshToken){
//             return next(new ErrorHandler(401, "Unauthorized request"))
//         }
//     try {
//         const decodedToken = jwt.verify(
//             incomingRefreshToken,
//             process.env.REFRESH_TOKEN_SECRET
//         )

//         const user = await User.findById(decodedToken?._id)

//         if(!user){
//             return next(new ErrorHandler(401, "Invalid refresh token"))
//         }

//         if( incomingRefreshToken !== user?.refreshToken){
//             return next(new ErrorHandler(401, "Refresh token is expired or used"))
//         }

//         const options = {
//             httpOnly: true,
//             secure: true,
//         }

//         const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

//         return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", newRefreshToken, options)
//         .json(
//             {
//                 success: true,
//                 accessToken,
//                 refreshToken: newRefreshToken,
//                 message:"Access token refreshed"
//             }
//         )

//     } catch (error) {
//         console.log(error.message);
//         return next(new ErrorHandler(500, 'Internal Server Error'));
//     }
// }
// // *-----------------------------
// // GET USER DATA
// // *------------------------------

// const userProfile = async (req, res) =>{
//     try {
//         const userData = req.user;
//         console.log(userData);
//         if (!userData) {
//             return next(new errorMiddleware(404, "User data not found"));
//         }
//         return res.status(200).json(
//             {
//                 success:true,
//                 userData
//             });
//     } catch (error) {
//         console.error( `Error from the user data route ${error}`);
//         return next(new ErrorHandler(500, 'Internal Server Error'));
//     }
// }


// module.exports = {signupUser, loginUser, logoutUser, refreshAccessToken, userProfile};