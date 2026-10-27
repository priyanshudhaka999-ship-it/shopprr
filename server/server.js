import cookieParser from 'cookie-parser'
import 'dotenv/config'
import express from "express"
import cors from 'cors'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
import connectCloudinary from './config/cloudinary.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

const app = express() // Initialize Express Application
const port = process.env.PORT || 4000 // Define server port

await connectDB() // establish connection with the database
await connectCloudinary() //setup cloudinary for image storage

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173','https://shopprr-ta4g.vercel.app']

// Middleware Setup
app.use(express.json()) // Enables JSON request body parsing
app.use(cookieParser()) // Cookie-parser middleware to parse HTTP request cookies
app.use(cors({
    origin: allowedOrigins, // Whitelist of allowed domains
    credentials: true // Required for cookies/authorization headers
}))

// Define api routes
app.use('/api/user',userRouter) // routes for user realted operations
app.use('/api/admin',adminRouter) // routes for admin realted operations
app.use('/api/product',productRouter) // routes for product realted operations
app.use('/api/cart',cartRouter) // routes for cart realted operations
app.use('/api/order',orderRouter) // routes for order realted operations

// root endpoint to check API status
app.get("/",(req,res)=>{
    res.send("successful")
})

// start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})