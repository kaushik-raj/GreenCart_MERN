import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB and Cloudinary
// These function are called at the time of server startup to establish connections to the database and cloud storage service.
await connectDB()
await connectCloudinary()

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173', 'https://green-cart-mern-brown.vercel.apphttps://green-cart-mern-9py3.vercel.app']

// Stripe webhook endpoint
// This endpoint is used to handle incoming webhook events from Stripe, such as payment confirmations or order updates.
// Stripe requires the raw body , 
// So we using this route before the parse JSON middleware , 
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware configuration
// To parse JSON bodies , which is used in POST requests , Data send in the body of the request are parsed into json objects .
app.use(express.json());

// cookieParser is used to parse cookies attached to the client request object.
// This is useful for reading cookies sent by the client, such as authentication tokens .
app.use(cookieParser());

// CORS (Cross-Origin Resource Sharing) is a security feature that allows or restricts resources on a web page to be requested from another domain outside the domain from which the first resource was served.
// This is used to allow requests from specific origins, which is necessary for frontend-backend communication .
app.use(cors({origin: allowedOrigins, credentials: true}));


// Routes configuration
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})