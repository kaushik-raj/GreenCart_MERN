import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {

    // product array is fetched from the AppContext
    // It contains an array of product objects .
    const {products, navigate, currency, addToCart} = useAppContext()
    // useParams is a hook from react-router-dom that allows us to access the URL parameters
    // In this case, we are using it to get the product ID from the URL
    const {id} = useParams()

    // State to manage related products and thumbnail image
    // relatedProducts will hold the products that are related to the current product based on category
    const [relatedProducts, setRelatedProducts] = useState([]);

    // thumbnail will hold the image of the product that is currently selected
    // It is initialized to null and will be set to the first image of the product once the product is fetched
    // This allows the user to see a larger version of the product image when they click on a side images 
    const [thumbnail, setThumbnail] = useState(null);
    // Find the product from the products array using the ID from the URL parameters
    // This will return the product object that matches the ID
    // product is an object that contains details like id, name, price, etc.
    const product = products.find((item)=> item._id === id);

    // useEffect hook to find related products based on the current product's category
    // It runs whenever the products array changes and at initial render
    useEffect(()=>{
        if(products.length > 0){
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item)=> product.category === item.category)
            setRelatedProducts(productsCopy.slice(0,5))
        }
    },[products])

    // useEffect hook to set the thumbnail image to the first image of the product
    // This ensures that when the product details page loads, the first image is displayed as the main image
    // It runs whenever the selected product changes ,  which happens when the user navigates to a different product
    // This is useful to ensure that the thumbnail is always set to the first image of the selected product
    useEffect(()=>{
        setThumbnail(product?.image[0] ? product.image[0] : null)
    },[product])


    // If the selected product is not found, return null to avoid rendering an empty page
    // This is useful to handle cases where the product ID in the URL does not match any product in the products array .
    return product && (
        <div className="mt-12">
            {/* Breadcrumb navigation to show the path to the current product */}
            {/* This helps users navigate back to previous pages easily */}
            <p>
                <Link to={"/"}>Home</Link> /
                <Link to={"/products"}> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            {/* Product details section */}
            {/* This section displays the product image, name, rating, price, and description */}
            <div className="flex flex-col md:flex-row gap-16 mt-4">

                {/* This section displays the product image and thumbnails */}
                {/* Product image section */}
                <div className="flex gap-3">

                    <div className="flex flex-col gap-3">
                        {/* Product is an object , but image in it is an array , that is why we are able to use .map function on it  */}
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    {/* This section displays the main product image */}
                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" />
                    </div>
                </div>

                {/* This section displays the product details */}
                {/* It includes the product name, rating, price, description, and buttons to add to cart or buy now */}
                <div className="text-sm w-full md:w-1/2">
                    {/* Product name */}
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    {/* Product rating */}
                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                          <img src={i<4 ? assets.star_icon : assets.star_dull_icon} alt="" className="md:w-4 w-3.5"/>
                             
                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

                    {/* Product price */}
                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
                        <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>
                    
                    {/* Product description */}
                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>
                    
                    {/* Add to cart and buy now buttons */}
                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={()=> addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                            Add to Cart
                        </button>
                        <button onClick={()=> {addToCart(product._id); navigate("/cart")}} className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition" >
                            Buy now
                        </button>
                    </div>  
                </div>
            </div>
            {/* ---------- related products -------------- */}
            <div className="flex flex-col items-center mt-20">

                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium">Related Products</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>
                
                {/* This section displays the related products in a grid layout */}
                {/* It maps through the relatedProducts array and renders a ProductCard component for each product */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                    {relatedProducts.filter((product)=>product.inStock).map((product, index)=>(
                        <ProductCard key={index} product={product}/>
                    ))}
                </div>

                {/* redirect to the main product page. */}
                <button onClick={()=> {navigate('/products'); scrollTo(0,0)}} className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition">See more</button>
            </div>
        </div>
    );
};


export default ProductDetails