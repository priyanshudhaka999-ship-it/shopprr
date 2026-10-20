import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
}, { minimize: false }); //minimize: false tells Mongoose to keep empty objects when saving documents to MongoDB, rather than removing them.

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;