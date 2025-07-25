import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative'>
      {/*  Background images for the main banner */}
      <img src={assets.main_banner_bg} alt="banner" className='w-full hidden md:block'/>
      {/* Mobile background image for the main banner */}
      {/* This image is only visible on mobile devices */}
      <img src={assets.main_banner_bg_sm} alt="banner" className='w-full md:hidden'/>

      {/* Overlay for the main banner */}
      {/* This overlay is used to create a dark effect on the background image */}
      <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15'
        >Freshness You Can Trust, Savings You will Love! </h1>
      
        {/* This section contains the main content of the banner
            It includes a brief description and a call-to-action button */}
        <div className='flex items-center mt-6 font-medium'>
          {/* This is a brief description of the banner */}
          <Link to={"/products"} className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'>
          Shop now
          {/* This is an arrow icon that appears next to the "Shop now" text */}
          {/* It is only visible on smaller screens (md and below) */}
          <img className='md:hidden transition group-focus:translate-x-1' src={assets.white_arrow_icon} alt="arrow" />
          </Link>

          {/* This is a link to explore deals */}
          {/* It is only visible on larger screens (md and above) */}
          <Link to={"/products"} className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer'>
          Explore deals
          <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="arrow" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainBanner
