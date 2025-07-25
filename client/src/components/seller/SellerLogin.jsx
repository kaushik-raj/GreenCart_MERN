import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const SellerLogin = () => {

    
    const {isSeller, setIsSeller, navigate, axios} = useAppContext()

    // State to hold email and password for login
    // These will be used to send login request to the server
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            // This will return a cookie which will be sotred in the browser .
            // Cookie contain a token , and token contains the email of the seller .
            const {data} = await axios.post('/api/seller/login', {email, password})
             
            if(data.success){
                // We are setting the SetIsSeller true here , but when we reload the page , then it will become false again , bcz it is initialized with false. 
                setIsSeller(true)
                navigate('/seller')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    }

    // If the user is already a seller, redirect to the seller page
    // This is to prevent the seller from accessing the login page again
    useEffect(()=>{
        if(isSeller){
            navigate("/seller")
        }
    },[isSeller])

  return !isSeller && (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600'>

        <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
            <p className='text-2xl font-medium m-auto'><span className="text-primary">Seller</span> Login</p>
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e)=>setEmail(e.target.value)} value={email}
                 type="email" placeholder="enter you email" 
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" required/>
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} value={password}
                 type="password" placeholder="enter your password"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" required/>
            </div>
            <button className="bg-primary text-white w-full py-2 rounded-md cursor-pointer">Login</button>
        </div>

    </form>
  )
}

export default SellerLogin
