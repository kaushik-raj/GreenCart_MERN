import User from "../models/User.js"

// Update User CartData : /api/cart/update
// This function updates the user's cart with the new items sent from the frontend.
export const updateCart = async (req, res)=>{
    try {
        // userId is added by the middleware authUser
        // cartItems is the updated cart items sent from the frontend
        const { userId, cartItems } = req.body     
        await User.findByIdAndUpdate(userId, {cartItems})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}