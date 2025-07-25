import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, dummyAddress } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
    const {products, currency, cartItems, removeFromCart, getCartCount, updateCartItem, navigate, getCartAmount, axios, user, setCartItems} = useAppContext()
    
    // cartArray will hold the products in the cart with their quantities
    // It is initialized as an empty array and will be populated with the products from the cart
    const [cartArray, setCartArray] = useState([])

    // addresses will hold the user's saved addresses
    // It is initialized as an empty array and will be populated with the addresses fetched from the server
    const [addresses, setAddresses] = useState([])
    // showAddress is a boolean state to control the visibility of the address selection dropdown
    // It is initialized as false, meaning the dropdown is hidden by default
    const [showAddress, setShowAddress] = useState(false)
    // selectedAddress will hold the address selected by the user for this order
    // It is initialized as null and will be set to the first address from the fetched addresses
    // This allows the user to select an address for delivery
    const [selectedAddress, setSelectedAddress] = useState(null)
    // paymentOption is a state to manage the selected payment method
    // It is initialized to "COD" (Cash on Delivery) and can be changed to "Online" for online payments
    const [paymentOption, setPaymentOption] = useState("COD")

    // getCart function will populate the cartArray with products from the cartItems state
    // It iterates over the cartItems object, finds the corresponding product in the products array
    // Product is an object that contains details like id, name, price, etc.
    // Product object is pushed into a temporary array with its quantity
    // That temporary array is then set to the cartArray state
    // Why are creating a new array instead of using cartItems directly?
    //    This is cartItem is storing which products are in the cart and how many of each — but it doesn't have any product details like name, price, or image.
    const getCart = ()=>{
        let tempArray = []
        for(const key in cartItems){
            const product = products.find((item)=>item._id === key)
            product.quantity = cartItems[key]
            tempArray.push(product)
        }
        setCartArray(tempArray)
    }

    // getUserAddress function fetches the user's saved addresses from the server
    // It sends a GET request to the server and updates the addresses state with the fetched addresses
    const getUserAddress = async ()=>{
        try {
            const {data} = await axios.get('/api/address/get');
            if (data.success){
                setAddresses(data.addresses)
                if(data.addresses.length > 0){
                    setSelectedAddress(data.addresses[0])
                }
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    // placeOrder function will handle the order placement
    // It checks if an address is selected, then sends a request to the server to place the order
    const placeOrder = async ()=>{
        try {
            if(!selectedAddress){
                return toast.error("Please select an address")
            }

            // Place Order with COD
            if(paymentOption === "COD"){
                const {data} = await axios.post('/api/order/cod', {
                    userId: user._id,
                    // Only sending the necessary things to the Order, like :- Item.id , item.quantity
                    // As cartArray also contain some other unnecessary things .
                    items: cartArray.map(item=> ({product: item._id, quantity: item.quantity})),
                    address: selectedAddress._id
                })

                if(data.success){
                    toast.success(data.message)
                    setCartItems({})
                    navigate('/my-orders')
                }else{
                    toast.error(data.message)
                }
            }else{
                // Place Order with Stripe
                const {data} = await axios.post('/api/order/stripe', {
                    userId: user._id,
                    items: cartArray.map(item=> ({product: item._id, quantity: item.quantity})),
                    address: selectedAddress._id
                })

                // After the session is created with the strip, the will redirect to the stripe payment page ,
                // After that , strip will redirect to the URl upon the completion of the payment .
                if(data.success){
                    window.location.replace(data.url)
                }else{
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // useEffect hook to get the cart items when the component mounts
    // This effect runs only once when the component mounts (Reload and first time visiting the site)
    useEffect(()=>{
        if(products.length > 0 && cartItems){
            getCart()
        }
    },[products, cartItems])

    // 
    useEffect(()=>{
        if(user){
            getUserAddress()
        }
    },[user])
    
    // if there is items in the product and also in the cart, we will render the cart page
    return products.length > 0 && cartItems ? (

        <div className="flex flex-col md:flex-row mt-16">
            {/* This section displays the cart items */}
            {/* It includes the product details, quantity, subtotal, and action buttons */}
            {/* Left part of the cart */}
            <div className='flex-1 max-w-4xl'>

                {/* Heading of the cart */}
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
                </h1>

                {/* Create a table like stucture to show the itmes in the cart*/}
                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {/* Map through the cartArray to display each product in the cart */}
                {/* cartArray contains the products in the cart with their quantities */}
                {cartArray.map((product, index) => (
                    // Each product is displayed in a grid layout with its details, subtotal, and action buttons
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">

                        {/* This section displays the product details */}
                        {/* It includes the product image, name, weight, and quantity selector */}
                        <div className="flex items-center md:gap-6 gap-3">

                            {/* click able image of the item in cart */}
                            <div onClick={()=>{
                                navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)
                            }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            
                            {/* This section displays the product details */}
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>

                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select onChange={e => updateCartItem(product._id, Number(e.target.value))}  value={cartItems[product._id]} className='outline-none'>
                                            {/* create a array of size 9 max else acc. to the size of the item in the cart , then create a drop down option with , values same as of index  */}
                                            {/* he value selected is then send to the updateCartItem function  */}
                                            {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>  {index + 1}  </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* This section displays the subtotal for each product */}
                        <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                        
                        {/* Action button to remove the item  */}
                        <button onClick={()=> removeFromCart(product._id)} className="cursor-pointer mx-auto">
                            <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6" />
                        </button>

                    </div>)
                )}

                {/* button to continue shopping  */}
                <button onClick={()=> {navigate("/products"); scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img className="group-hover:-translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="arrow" />
                    Continue Shopping
                </button>

            </div>

            {/* Right part of the cart */}
            {/* This section displays the order summary, delivery address, and payment method */}
            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                {/* Div to create delivery and Payment  */}
                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "No address found"}</p>
                        {/* Toggle b/w the showAddress dropdown */}
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>

                        {/* If showAddress is true, display the address selection dropdown */}
                        {/* This dropdown will show the user's saved addresses and allow them to select one */}
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                               {addresses.map((address, index)=>(
                                <p onClick={() => {setSelectedAddress(address); setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                    {address.street}, {address.city}, {address.state}, {address.country}
                                </p>
                            )) }
                                <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    {/* This section displays the payment method selection */}
                    <select onChange={e => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        {/* <option value="Online">Online Payment</option> */}
                    </select>
                </div>

                <hr className="border-gray-300" />
                {/* This section displays the total amount, shipping fee, and tax */}
                {/* It calculates the total amount based on the cart items and displays it */}
                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>{currency}{getCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{getCartAmount() * 2 / 100}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>
                            {currency}{getCartAmount() + getCartAmount() * 2 / 100}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition">
                    Place Order
                </button>
            </div>
        </div>
    ) : null
}

export default Cart;