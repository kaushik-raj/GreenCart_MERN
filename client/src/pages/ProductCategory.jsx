import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
import { categories } from '../assets/assets'
import ProductCard from '../components/ProductCard'

const ProductCategory = () => {

    // products is fetched from the AppContext
    // It contains an array of product objects
    const { products } =  useAppContext()

    // useParams is a hook from react-router-dom that allows us to access the URL parameters
    // In this case, we are using it to get the category from the URL
    const { category } = useParams()

    // Search for the category in the categories array, to check where the category is present
    // This is useful to display the category name in the UI
    const searchCategory = categories.find((item)=> item.path.toLowerCase() === category)

    // filter the products based on the category
    // This will return an array of products that belong to the selected category
    const filteredProducts = products.filter((product)=>product.category.toLowerCase() === category)

  return (
    <div className='mt-16'>
      {/* Display the category name if it is found in the categories array */}
      {/* This is useful to show the user which category they are currently viewing */}
      {searchCategory && (
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
            <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}
      
      {/* Display the filtered products in a grid layout */}
      {/* If there are no products in the category, display a message indicating that there are no products found */}
      {filteredProducts.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
            {filteredProducts.map((product)=>(
                <ProductCard key={product._id} product={product}/>
            ))}
        </div>
      ): (
        <div className='flex items-center justify-center h-[60vh]'>
            <p className='text-2xl font-medium text-primary'>No products found in this category.</p>
        </div>
      )}
    </div>
  )
}

export default ProductCategory
