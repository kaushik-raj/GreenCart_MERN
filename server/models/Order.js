import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // userId is a reference to the user who placed the order,taking from the user model
    userId: {type: String, required: true, ref: 'user'},
    items: [{
        // product is a reference to the product being ordered, taking from the product model
        product: {type: String, required: true, ref: 'product'},
        quantity: {type: Number, required: true}
    }],
    amount: {type: Number, required: true},
    // address is a reference to the address model, taking from the address model
    address: {type: String, required: true, ref: 'address'},
    status: {type: String, default: 'Order Placed'},
    paymentType: {type: String, required: true},
    isPaid: {type: Boolean, required: true, default: false},
},{ timestamps: true })


// Ensure that if the model already exists, it is not redefined .
const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order