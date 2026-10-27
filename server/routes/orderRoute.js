import express from "express"
import authAdmin from "../middleware/authAdmin.js"
import { allOrders, placeOrderCOD, updateStatus, userOrders } from "../controllers/orderController.js"
import authUser from "../middleware/authUser.js"
import {
   
   
    placeOrderRazorpay,
    verifyRazorpayPayment,
   
    
} from "../controllers/orderController.js";

const orderRouter = express.Router()

// For Admin
orderRouter.post('/list', authAdmin, allOrders)
orderRouter.post('/status', authAdmin, updateStatus)
// For Payment
orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.post(
    "/razorpay",
    authUser,
    placeOrderRazorpay
);

orderRouter.post(
    "/verify-razorpay",
    authUser,
    verifyRazorpayPayment
);
// For User
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter