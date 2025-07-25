import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) =>{

    // The seller's token is extracted from the cookies of the request object.
    // This token is set when the seller logs in, and it is used to authenticate the seller in subsequent requests.
    // If the token is not present, it means the seller is not authenticated, and an error message is returned.
    const { sellerToken } = req.cookies;

    if(!sellerToken) {
        return res.json({ success: false, message: 'Not Authorized' });
    }

    try {
            const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
            if(tokenDecode.email === process.env.SELLER_EMAIL){
                // here we are not setting any userId in the request body , bcz there is only one seller
                // Since there is only one seller, then all we need to verify that the request is coming from the authenticated seller.
                // if yes , then move to the next middleware or route handler
                next(); 
            }else{
                return res.json({ success: false, message: 'Not Authorized' });
            }
            
        } catch (error) {
            res.json({ success: false, message: error.message });
        }
}

export default authSeller;