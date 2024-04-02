const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    username :{
        type: String,
        required:true,
        index: true
    },
    phone :{
        type: String,
        required:true,
        unique: true
    },
    email :{
        type: String,
        required:true,
        unique: true
    },
    password :{
        type: String,
        required:true,
    },
    refreshToken:{
        type: String
    }
},{timestamps:true});

//secure the password with the bcrypt
userSchema.pre('save',async function(next){
    const user = this;

    if(!user.isModified('password')){
       return next();
    }

    try {
        const saltRound = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(user.password, saltRound);
        user.password = hashed_password;
    } catch (error) {
        console.error(error);
    }
});

// compare the password using schema method
userSchema.methods.comparePassword = async function(password){
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error(error);
    }
}

//json web token
userSchema.methods.generateAccessToken = function(){
    try {
        return jwt.sign({
            _id : this._id,
            email : this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
        );
    } catch (error) {
        console.error(error);
    }
};
userSchema.methods.generateRefreshToken = function(){
    try {
        return jwt.sign({
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
        );
    } catch (error) {
        console.error(error);
    }
};


// define the model or the collection name
const User = new mongoose.model("User", userSchema);

module.exports = User;