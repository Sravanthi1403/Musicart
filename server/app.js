const express = require('express');
const app = express();
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoute');
const productRoutes = require('./routes/productRoute');
const orderRoutes = require('./routes/orderRoute');
const cartRoutes = require('./routes/cartRoute');
const feedbackRoutes = require('./routes/feedbackRoute');
const {errorMiddleware} = require("./utils/ErrorHandler");
const cookieParser = require('cookie-parser');
const cors = require("cors");

dotenv.config({path: './.env'});
app.use(cookieParser());
app.use(cors({
    origin : 'https://musicart-frontend-eight.vercel.app/',
    methods : [ "GET","POST","PUT","PATCH", "DELETE" ],
    credentials : true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.get('/', (req, res) => {
    res.json({
        success : true,
        message : 'Server is working fine'
    })
})
// routes 

app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/feedbacks', feedbackRoutes);

app.use(errorMiddleware);

module.exports = app
