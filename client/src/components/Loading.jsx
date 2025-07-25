import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { useLocation } from 'react-router-dom'

const Loading = () => {

    const { navigate } = useAppContext()
    // To extract the search query from the URl . 
    let { search } = useLocation()
    const query = new URLSearchParams(search)
    const nextUrl = query.get('next');

    // It’s used after Stripe redirects the user back, to:
      // 1 Show a loading animation 
      // 2 Extract the nextUrl value from the query 
      // After showing animation for 5 sec , simple navigate to the target page.
      // During this 5 sec , strip will verify the payment .
    useEffect(()=>{
        if(nextUrl){
            setTimeout(()=>{
                navigate(`/${nextUrl}`)
            },5000)
        }
    },[nextUrl])

  return (
    <div className='flex justify-center items-center h-screen'>
      {/* To show a loading icon  */}
      <div className='animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary'></div>
    </div>
  )
}

export default Loading
