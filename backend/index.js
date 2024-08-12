const express = require('express')
const dotenv = require('dotenv')
const connectdb = require('./db');
const cookieParser = require('cookie-parser');
const UserRouter = require('./routes/UserRoutes')
const PostRouter = require('./routes/PostRoutes')
const cloudinary = require('cloudinary').v2;

dotenv.config();
connectdb();

const app = express()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
}),

//Middleware
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({extended: false , limit: '150mb'}));
app.use(cookieParser());

//Routes
app.use('/api/users', UserRouter);
app.use('/api/posts', PostRouter);

//server listening
app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`)
})