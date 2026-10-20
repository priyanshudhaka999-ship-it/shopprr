import cookieParser from 'cookie-parser'
import 'dotenv/config'
import express from "express"
import cors from 'cors'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoute.js'

const app = express() // Initialize Express Application
const port = process.env.PORT || 4000 // Define server port

await connectDB() // establish connection with the database

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173']

// Middleware Setup
app.use(express.json()) // Enables JSON request body parsing
app.use(cookieParser()) // Cookie-parser middleware to parse HTTP request cookies
app.use(cors({
    origin: allowedOrigins, // Whitelist of allowed domains
    credentials: true // Required for cookies/authorization headers
}))

// Define api routes
app.use('/api/user',userRouter) // routes for user realted operations

// root endpoint to check API status
app.get("/",(req,res)=>{
    res.send("successful")
})

// start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})