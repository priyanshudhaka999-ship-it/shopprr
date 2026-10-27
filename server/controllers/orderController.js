import productModel from "../models/productModel.js"
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import crypto from "crypto";
import Razorpay from "razorpay";




// Global variables for payment
const currency = "pkr"
const deliveryCharges = 10;
const taxPercentage = 0.02;

const getRazorpay = () => {
    if (
        !process.env.RAZORPAY_KEY_ID ||
        !process.env.RAZORPAY_KEY_SECRET
    ) {
        throw new Error("Razorpay keys are missing from server/.env");
    }

    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

// Place order using COD = /api/order/cod
export const placeOrderCOD = async (req,res)=>{
    try {
        const {items, address} = req.body
        const userId = req.userId

        if(items.length === 0) {
            return res.json({success:false, message: "Please add product first"})
        }
        // calculate amount using items
        let subtotal = await items.reduce(async (acc, item)=>{
            const product = await productModel.findById(item.product)
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        // calculate total
        const taxAmount = subtotal * taxPercentage
        const totalAmount = subtotal + taxAmount + deliveryCharges

        await orderModel.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentMethod: "COD"
        })

        // Clear user Cart
        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        return res.json({success:true, message: "Order Placed"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//this recalculates prices using your database instead of trusting prices sent by the browser.
const calculateOrder = async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Please add products to your cart");
    }

    let subtotal = 0;

    for (const item of items) {
        if (
            !item.product ||
            !item.size ||
            !Number.isInteger(Number(item.quantity)) ||
            Number(item.quantity) < 1
        ) {
            throw new Error("Invalid cart item");
        }

        const product = await productModel.findById(item.product);

        if (!product) {
            throw new Error("A product in your cart no longer exists");
        }

        if (product.inStock === false) {
            throw new Error(`${product.name} is out of stock`);
        }

        subtotal += Number(product.offerPrice) * Number(item.quantity);
    }

    const taxAmount = subtotal * taxPercentage;

    const totalAmount = Math.round(
        (subtotal + taxAmount + deliveryCharges) * 100
    ) / 100;

    return { subtotal, taxAmount, totalAmount };
};

// POST /api/order/razorpay
export const placeOrderRazorpay = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.userId;

        if (!address || typeof address !== "object") {
            return res.status(400).json({
                success: false,
                message: "Delivery address is required",
            });
        }

        const { totalAmount } = await calculateOrder(items);

        // First create a pending order in MongoDB
        const order = await orderModel.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentMethod: "Razorpay",
            isPaid: false,
        });

        // Then create the corresponding Razorpay order
        const razorpayOrder = await getRazorpay().orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString(),
            notes: {
                mongoOrderId: order._id.toString(),
                userId: String(userId),
            },
        });

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            mongoOrderId: order._id.toString(),
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Could not start payment",
        });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { mongoOrderId, razorpay_payment_id } = req.body;

        const order = await orderModel.findOne({
            _id: mongoOrderId,
            userId: req.userId
        });

        if (!order) {
            return res.json({
                success: false,
                message: "Order not found"
            });
        }

        const razorpay = getRazorpay();

        const payment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        if (
            payment.order_id !== order.razorpayOrderId ||
            payment.status !== "captured"
        ) {
            return res.json({
                success: false,
                message: "Payment not completed"
            });
        }

        order.isPaid = true;
        order.razorpayPaymentId = razorpay_payment_id;

        await order.save();

        await userModel.findByIdAndUpdate(req.userId, {
            cartData: {}
        });

        res.json({
            success: true,
            message: "Payment successful"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Payment verification failed"
        });
    }
};

// ALL Orders data for Frontend by UserId = /api/order/userorders
export const userOrders = async (req,res)=>{
    try {
        const userId = req.userId

        const orders = await orderModel.find({userId, $or: [{paymentMethod: "COD"}, {isPaid:true}]}).populate("items.product").sort({createdAt: -1})
        res.json({success:true, orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// ALL Orders data for Admin panel = /api/order/list
export const allOrders = async (req,res)=>{
    try {
        const orders = await orderModel.find({$or: [{paymentMethod: "COD"}, {isPaid:true}]}).populate("items.product")
        res.json({success:true, orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// Updating order status form admin panel = /api/order/status
export const updateStatus = async (req,res)=>{
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, {status})

        res.json({success:true, message: "Order Status Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}
