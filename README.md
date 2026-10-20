// we'll not install nodemon with  other dependencies we'll install it as dev dependency ' npm i nodemon --save-dev' bcoz we dont want it in production we want it in development 

Understand this code -
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))