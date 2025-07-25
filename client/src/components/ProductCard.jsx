import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";


const ProductCard = ({product}) => {
    // useAppContext is a custom hook that provides access to the AppContext
    // It allows us to access the currency, addToCart, removeFromCart
    // cartItem is an array of product objects It conatin the product details 
    const {currency, addToCart, removeFromCart, cartItems, navigate} = useAppContext()

   
    return product && (
        // This component renders a product card with product details
        // It includes product image, name, category, price, and an option to add/remove

        <div onClick={()=> {navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}} className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
            {/* This section displays the product image */}
            {/* The image is wrapped in a div with a hover effect that scales the image */}
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name} />
            </div>
            {/* This section displays the product details */}
            {/* It includes the product category, name, rating, and price */}
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                {/* This section displays the product rating */}
                {/* It uses a star icon to represent the rating visually */}
                <div className="flex items-center gap-0.5">
                    {/* Create an array of 5 elements , fill them with empty value , use map to iterate over each element , then use i as index  */}
                    {/* then use that i(index) for printing the starts for a fix number of times  */}
                    {/* Here we didn't use loop to do so , bcz using map is for :-  React wants an array of elements to render when you're repeating something. */}
                    {Array(5).fill('').map((_, i) => (
                           <img key={i} className="md:w-3.5 w3" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt=""/>
                    ))}
                    <p>(4)</p>
                </div>
                {/* This section displays the product price */}
                {/* It shows the offer price and the original price with a strikethrough */}
                <div className="flex items-end justify-between mt-3">

                    {/* Display the offer price and original price */}
                    <p className="md:text-xl text-base font-medium text-primary">
                        {currency}{product.offerPrice}{" "} <span className="text-gray-500/60 md:text-sm text-xs line-through">{currency}{product.price}</span>
                    </p>
                    
                    {/* This section displays the add to cart button or the quantity selector */}
                    {/* If the product is not in the cart, it shows an "Add" button */}
                    
                    <div onClick={(e) => { e.stopPropagation(); }} className="text-primary">
                        {!cartItems[product._id] ? (
                            <button className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer" onClick={() => addToCart(product._id)} >
                                <img src={assets.cart_icon} alt="cart_icon"/>
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                <button onClick={() => {removeFromCart(product._id)}} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>

                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                
                                <button onClick={() => {addToCart(product._id)}} className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;