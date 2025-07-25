import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {

    // useAppContext is a custom hook that provides access to the AppContext
    // It allows us to access the navigate function from the context
    const {navigate} = useAppContext()

  return (
    // This component renders a list of categories
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Categories</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>

        {/* Map through the categories array and render each category */}
        {/* Each category is displayed as a div with an image and text */}
        {/* The onClick event navigates to the product category page when the category is clicked */}
        {/* The scrollTo(0,0) function is used to scroll to the top of the page when navigating to a new category */}
        {/* We have used implicite return of the newly create items */}
        {categories.map((category, index)=>(
          // This is a div that represents a each category
            <div key={index} className='group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center'
            style={{backgroundColor: category.bgColor}}
            onClick={()=>{
                navigate(`/products/${category.path.toLowerCase()}`);
                scrollTo(0,0)
            }}
            >
                <img src={category.image} alt={category.text} className='group-hover:scale-108 transition max-w-28'/>
                <p className='text-sm font-medium'>{category.text}</p>
            </div>
                    
        ))}

        
      </div>
    </div>
  )
}

export default Categories
