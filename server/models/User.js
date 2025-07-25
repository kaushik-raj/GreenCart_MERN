import mongoose from "mongoose";

// Create a schema for the User model
// This schema defines the structure of the user documents in the MongoDB database.
// By default, Mongoose will remove empty objects from your document before saving them. that's why we set {minimize: false} to allow empty objects.
const userSchema = new mongoose.Schema({
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true },
    cartItems: {type: Object, default: {} },
}, {minimize: false})

// Create the User model using the schema
// This model will be used to interact with the user collection in the MongoDB database.
// If the model already exists, it will use the existing model instead of creating a new one.
// This is useful to avoid errors when the server restarts and tries to redefine the model.
const User = mongoose.models.user || mongoose.model('user', userSchema)

// Export the User model 
export default User