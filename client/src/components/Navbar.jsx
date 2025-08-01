import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useState } from 'react'

const Navbar = () => {
    // State to manage the mobile menu open/close
    const [open, setOpen] = useState(false)
    // setshowUserLogin is used to control the visibility of the login modal
    // user is the current user object, setUser is used to update the user state
    const {user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios} = useAppContext();

    // Function to log out the user
    // It sends a request to the server to log out and updates the user state
    const logout = async ()=>{
      try {
        const { data } = await axios.get('/api/user/logout')
        if(data.success){
          toast.success(data.message)
          setUser(null);
          navigate('/')
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
        
    }
    // useEffect hook to navigate to the products page when the searchQuery changes
    // This is useful for redirecting the user to the products page when they search for a product .
    useEffect(()=>{
      if(searchQuery.length > 0){
        navigate("/products")
      }
    },[searchQuery])

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

      
      {/* Logo */}
      <NavLink to='/' onClick={()=> setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/products'>All Product</NavLink>
        <NavLink to='/seller'>Seller</NavLink>

        {/* Search bar */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input onChange={(e)=> setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
         <img src={assets.search_icon} alt='search' className='w-4 h-4'/>
        </div>

        {/* Cart Icon */}
        
        <div onClick={()=> navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80'/>
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
        </div>

        

        {/* User Profile */}
        {/*  Conditional rendering based on user login status of profile page and drop down menu*/}
        {!user ? ( <button onClick={()=> setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
          Login
        </button>)
        :
        (
          <div className='relative group'>
            <img src={assets.profile_icon} className='w-10' alt="" />
            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
              <li onClick={()=> navigate("my-orders")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
              <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {/* 3 line menu for mobile */}
      {/* Conditional rendering based on user login status */}
      <div className='flex items-center gap-6 sm:hidden'>
            <div onClick={()=> navigate("/cart")} className="relative cursor-pointer">
                <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80'/>
                <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
              </div>
          <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
              <img  src={assets.menu_icon} alt='menu'/>
            </button>
      </div>
      {/*  Mobile Navigation Dropdown */}
      {/*  Conditional rendering based on user open status variable  */}
      { open && (
        <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
        <NavLink to="/" onClick={()=> setOpen(false)}>Home</NavLink>
        <NavLink to="/products" onClick={()=> setOpen(false)}>All Product</NavLink>
        {/*  Conditional rendering based on user login status */}
        {user && 
        <NavLink to="/products" onClick={()=> setOpen(false)}>My Orders</NavLink>
        }

        <NavLink to="/" onClick={()=> setOpen(false)}>Contact</NavLink>

        {/* Search bar for mobile */}
        {/* login and logout button */}
        {!user ? (
          <button onClick={()=>{
            setOpen(false);
            setShowUserLogin(true);
          }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
          Login
        </button>
        ) : (
          <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
          Logout
        </button>
        )}
        
      </div>
      )}

    </nav>
  )
}

export default Navbar
