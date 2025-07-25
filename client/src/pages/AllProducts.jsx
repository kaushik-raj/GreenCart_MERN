import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const AllProducts = () => {

    // Product data is fetched from the AppContext
    // It contains an array of product objects
    // searchQuery is used to filter products based on user input , it is used in the Navbar component
    // It is a string that contains the search query entered by the user in the navbar search input
    const {products, searchQuery } = useAppContext()

    // State to manage filtered products based on search query
    // This state will hold the products that match the search query
    const [filteredProducts, setFilteredProducts] = useState([])

    // useEffect hook to filter products based on the search query
    // It runs whenever the products or searchQuery changes
    useEffect(()=>{
        if(searchQuery.length > 0){
            setFilteredProducts(products.filter(
                (product) => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
          }else{
              setFilteredProducts(products)
            }
    },[products, searchQuery])

  return (
    <div className='mt-16 flex flex-col'>
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium uppercase'>All products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
           {filteredProducts.filter((product)=> product.inStock).map((product, index)=>(
            <ProductCard key={index} product={product}/>
           ))}
        </div>

    </div>
  )
}

export default AllProducts
