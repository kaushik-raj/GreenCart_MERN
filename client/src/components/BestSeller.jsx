import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  // products is fetched from the AppContext
  // It contains an array of product objects
    const { products } = useAppContext();

  // This component renders a list of best-selling products
  // It filters the products to only include those that are in stock
  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>

        {/* This maps through the products array and renders a ProductCard for each product
            It filters the products to only include those that are in stock */}
        {products.filter((product)=> product.inStock).slice(0,5).map((product, index)=>(
            <ProductCard key={index} product={product}/>
        ))}
        
      </div>
    </div>
  )
}

export default BestSeller
