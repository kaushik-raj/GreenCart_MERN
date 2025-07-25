import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";


// Axois will make all the backend connection using this URL.
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
// Now all axios.get(), axios.post() requests will send cookies automatically.
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{
    // Currency is set from environment variable for consistency across the application
    const currency = import.meta.env.VITE_CURRENCY;
    // useNavigate hook from react-router-dom to programmatically navigate
    const navigate = useNavigate();
    // State to manage user authentication, seller status, login modal visibility, products, and cart items
    const [user, setUser] = useState(null)
    // State to manage seller status
    // This is used to check if the user is a seller or not
    const [isSeller, setIsSeller] = useState(false)
    // State to manage visibility of the user login modal
    const [showUserLogin, setShowUserLogin] = useState(false)
    // State to manage the list of products
    // It is an array of product objects fetched from the server
    // Each product object contains details like id, name, price, etc.
    const [products, setProducts] = useState([])
    // State to manage cart items, initialized as an empty object
    // It will hold the product IDs as keys and their quantities as values
    // This allows for easy manipulation of cart items
    const [cartItems, setCartItems] = useState({})

    // State to manage search query
    const [searchQuery, setSearchQuery] = useState({})

    // Fetch Seller Status
    // When the seller reload the page , the SetISSeller state becomes fales (As initialized) ,
    // This function is called when the seller reloads the page , 
    // It send the cookie with it , and the server authorized it , then state varible is again changed to TRUE . 
    const fetchSeller = async ()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true)
            }else{
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }
    }

    // Fetch User Auth Status , User Data and Cart Items
    const fetchUser = async ()=>{
        try {
            const {data} = await axios.get('api/user/is-auth');
            if (data.success){
                setUser(data.user)
                setCartItems(data.user.cartItems)
            }
        } catch (error) {
            setUser(null)
        }
    }



    // Fetch All Products
    // Storing them in products state Variable.
    const fetchProducts = async ()=>{
        try {
            const { data } = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Add Product to Cart
    const addToCart = (itemId)=>{
        // We are not directly mutating the cartItems state , 
        // We should not mutate the state directly bcz it can lead to unexpected behavior in React.
        // Instead, we create a new object using structuredClone to avoid direct mutation
        // Then make changes in the new object and set it to the cartItems state
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1;
        }

        // As cartItems is an object, so it would not create a duplicate entry for the same product , instead it will update the quantity of that product
        // This is useful for maintaining the cart state in a consistent manner
        setCartItems(cartData);
        toast.success("Added to Cart")
    }

    // Update Cart Item to a specific quantity , used at carts page . 
    // This function updates the quantity of a specific item in the cart
    const updateCartItem = (itemId, quantity)=>{
        // Again we are not direclty mutating the cartItems state , same reason as above(addToCart)
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData)
        toast.success("Cart Updated")
    }

    // Remove Product from Cart
    const removeFromCart = (itemId)=>{
        // Again, we are not directly mutating the cartItems state, same reason as above(addToCart)
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -= 1;
            if(cartData[itemId] === 0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from Cart")
        setCartItems(cartData)
    }

    // Get total Count of Cart Items
    // Here we didn't use any useState to store the total count of cart items , bcz when the cartItems changes, we can directly calculate the total count from the cartItems object
    // This function is also called at the time of rendering the cartItems useState variable.
    const getCartCount = ()=>{
        let totalCount = 0;
        for(const item in cartItems){
            // We are using cartItems[item] to get the quantity of each item in the cart
            totalCount += cartItems[item];
        }
        return totalCount;
    }

    // Get Cart Total Amount
    // Here we still didn't use any useState to store the total amount of cart items, bcz when the cartItems changes, we can directly calculate the total amount from the cartItems object
    // This function is also called at the time of rendering the cartItems useState variable.
    const getCartAmount = () =>{
        let totalAmount = 0;
        for (const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            if(cartItems[items] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[items]
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }


    // Fetch user and seller data when the component mounts (Reload and first time visitng the site)
    // This effect runs only once when the component mounts (Reload and first time visitng the site)
    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[])


    // Update Database Cart Items
    // This effect runs whenever cartItems changes
    // It sends a request to the server to update the cart items in the database
    // it is been called in the UpdateCartItem function , bcz , when CartItem state variable changes , the UpdateCart function is called . 
    useEffect(()=>{
        const updateCart = async ()=>{
            try {
                const { data } = await axios.post('/api/cart/update', {cartItems})
                if (!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        // updateCart function is only called when it is from the user . 
        if(user){
            updateCart()
        }
    },[cartItems])

    // Context value to be provided to the components , it inlcuddes diffrerent states and functions
    const value = {navigate, user, setUser, setIsSeller, isSeller,
        showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts, setCartItems
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}
