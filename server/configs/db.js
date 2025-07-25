import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));

        // It will create a new database called greencart if it does not exist.
        // If it exists, it will connect to the existing database.
        await mongoose.connect(`${process.env.MONGODB_URI}/greencart`)
        
    } catch (error) {
        console.error(error.message);
    }
}


export default connectDB;