import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
  const { token } = req.cookies //The curly braces tell JavaScript: "Look inside the req.cookies object, find the property named token, and extract its value into a new variable called token."
// It is a cleaner, shorthand way of writing : const token = req.cookies.token;

//The return is important because you don't want the remaining code to execute when there is no token.

  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login again" })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
// hecks that the token's signature is valid using your secret key.
//Checks whether the token has expired, if an expiration was set.

    if (decoded.id) {
      req.userId = decoded.id  //code saves that ID on the request
    } else {
      return res.json({ success: false, message: "Not Authorized Login again" })
    }
    next() //If the token is valid, the middleware calls next() to pass control to the next middleware or route handler in the stack.
    // what route handler is next? The route handler that is next is the one that is defined in the userRoute.js file. The route handler is the isAuth function that is defined in the userController.js file.
    // how it knows which route handler is next? It knows because the authUser middleware is used in the userRoute.js file before the isAuth route handler. The order of middleware and route handlers in Express matters. When a request comes in, Express will execute the middleware and route handlers in the order they are defined.
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

export default authUser