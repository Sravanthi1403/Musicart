const {z} = require('zod');


const indianPhoneRegex = /^[6-9]\d{9}$/;
  
const signupSchema = z.object({
    username: z
    .string({required_error:"Name is required"})
    .trim()
    .min(3,{ message:"Name must be at least of 3 characters."})
    .max(255,{message:"Name must not be more than 255 characters"}),
    phone: z
    .string({required_error : "Mobile number is required"})
    .regex(indianPhoneRegex, 'Invalid Number!'),
    email: z
    .string({ required_error : "Email is required"})
    .trim()
    .email({message:"Invalid email address"})
    .min(3,{message:"Email must be at least of 3 characters"})
    .max(255,{message:"Email must not be more than 255 characters"}),
    password: z
    .string({required_error:"Password is required"})
    .min(6,{message:"Password must be at least of 6 characters"})
    .max(20,{message: "Password can't be greater than 20 characters"}),
});

const loginSchema = z.object({
    PhoneOrEmail: z
        .string({ required_error: "email or mobile number is required" })
        .trim()
        .min(3, { message: "Value must be at least of 3 characters" })
        .max(255, { message: "Value must not be more than 255 characters" })
        .refine(value => {
            // Checking if value is either an email or a valid phone number
            return z.string().email().safeParse(value).success ||
            indianPhoneRegex.test(value);
        }, { message: "Invalid email address or mobile number" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must be at least of 6 characters" })
        .max(20, { message: "Password can't be greater than 20 characters" }),
});


module.exports = {signupSchema, loginSchema};