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


