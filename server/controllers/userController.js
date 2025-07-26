import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Register User : /api/user/register
export const register = async (req, res)=>{
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'})
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Store the data in the database using the User model.
        const user = await User.create({name, email, password: hashedPassword})

        // It generates a signed token that includes the user's ID and sets it to expire in 7 days.
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        // The token is then sent to the client as a cookie, which is configured to be HTTP-only, secure in production, and with a same-site policy to prevent CSRF attacks.
        // Sends a cookie called token 
        // This cookie will be stored in the browser and automatically sent back with every future request.
        
        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Login User : /api/user/login
export const login = async (req, res)=>{
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.json({success: false, message: 'Email and password are required'});
        }


        // Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.json({success: false, message: 'Invalid email or password'});
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)
            return res.json({success: false, message: 'Invalid email or password'});

        // Generate JWT token
        // The token is signed with a secret key and includes the user's ID, set to expire
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, 
            // The cookie will only be sent over HTTP'S' connections (i.e., encrypted, secure).
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Check Auth : /api/user/is-auth 
// Used in appcontext files.
// This function is used to check if the user is authenticated and get their details from the database after verifying the token using middleware.
export const isAuth = async (req, res)=>{
    try {
        // The user ID is extracted from the request body, which was set by the authUser middleware.
        const { userId } = req.body;

        const user = await User.findById(userId).select("-password")
        // sending the user details back to the client
        return res.json({success: true, user})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Logout User : /api/user/logout
export const logout = async (req, res)=>{
    try {
        // removing the cookie named 'token' from the user's browser
        // This effectively logs the user out by clearing their authentication token. 
        res.clearCookie('token', {
            httpOnly: true,
            // The cookie will only be sent over HTTP'S' connections (i.e., encrypted, secure).
            secure: process.env.NODE_ENV === 'production',
            // Controls if the cookie can be sent when another website calls your backend.
            // In production :- cookies can be send across domains
            // In Dev :- we don't really use it , bcz we manually add cookies in the requests. 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}