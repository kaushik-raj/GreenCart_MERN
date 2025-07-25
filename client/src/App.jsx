import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from "react-hot-toast";
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import Loading from './components/Loading';

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller");
  const {showUserLogin, isSeller} = useAppContext()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>

    {/*  Navbar is conditionally rendered based on the current path
        If the path includes "seller", the Navbar is not displayed */}
     {isSellerPath ? null : <Navbar/>} 

      {/* Login modal is conditionally rendered based on the showUserLogin state */}
      {/* If showUserLogin is true, the Login component is displayed */}
     {showUserLogin ? <Login/> : null}

      {/* using this so that we can popup messages in the app */}
     <Toaster />

      {/* The main content of the application is wrapped in a div with padding */}
      {/* The padding is adjusted based on whether the current path is a seller path */}
      {/* If it is a seller path, no padding is applied */}
      {/* If it is not a seller path, padding is applied to the left and right sides */}
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/products' element={<AllProducts/>} />
          {/* useparams will be used in the ProductCategory to fetch the value of :category */}
          <Route path='/products/:category' element={<ProductCategory/>} />
          <Route path='/products/:category/:id' element={<ProductDetails/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/add-address' element={<AddAddress/>} />
          <Route path='/my-orders' element={<MyOrders/>} />
          <Route path='/loader' element={<Loading/>} />
          {/* If the user is a seller then it will be redirected to the sellers page , else to the sellerLogin page */}
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            <Route index element={isSeller ? <AddProduct/> : null} />
            <Route path='product-list' element={<ProductList/>} />
            <Route path='orders' element={<Orders/>} />
          </Route>
        </Routes>
      </div>
      {/* Footer is conditionally rendered based on the current path */}
      {!isSellerPath && <Footer/>}
    </div>
  )
}

export default App
