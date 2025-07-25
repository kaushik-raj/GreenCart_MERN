import jwt from 'jsonwebtoken';

const authUser = async (req, res, next)=>{
    // The token is extracted from the cookies of the request object.
    // This token is set when the user logs in or registers, and it is used to authenticate the user in subsequent requests.
    // If the token is not present, it means the user is not authenticated, and an error message is returned.
    const {token} = req.cookies;

    if(!token){
        return res.json({ success: false, message: 'Not Authorized' });
    }

    try {
        // Verify the token using the secret key
        // If the token is valid, it will decode the token and extract the user ID
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        
        // The user ID is then added to the request body for further processing
        // This allows the next middleware or route handler to access the user ID
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id;
        }else{
            return res.json({ success: false, message: 'Not Authorized' });
        }
        next();

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export default authUser;