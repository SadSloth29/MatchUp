import React from 'react'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import { Link } from 'react-router-dom'
const NavBar = ({isHome}) => {
  return (
    <nav className='flex gap-5 bg-[rgb(96,89,186)] rounded-2xl m-5 mb-2 mt-0 max-w-auto h-12 justify-start items-center'>
       <div className='flex gap-5 ml-10 mr-10 justify-evenly items-center text-[#f7136e] '>
        {isHome && (
        <div>
        <a className="rounded-4xl w-auto bg-[rgba(234,235,249,255)] pt-1 pb-1 pl-4 pr-4 border-solid border-1 border-black" href='#home'>HOME</a>
        <a className="rounded-4xl w-auto bg-[rgba(234,235,249,255)] pt-1 pb-1 pl-4 pr-4 border-solid border-1 border-black" href='#about'>ABOUT US</a>
        <a className="rounded-4xl w-auto bg-[rgba(234,235,249,255)] pt-1 pb-1 pl-4 pr-4 border-solid border-1 border-black" href='#services'>SERVICES</a>
        </div>
      )}
       </div>
       <div className='flex justify-center items-center md:mr-40 md:ml-40 pr-12 pl-12'>
        <h1 className='text-transparent bg-clip-text text-2xl font-bold  border-solid border-black border-2 border-r-4 border-l-4 p-1'>
            <span className='text-[#fde7f0]' >MATCH</span>
            <span className='text-[#ff3888]'>UP</span></h1>
       </div>
       <div className='flex gap-8 justify-between items-center text-white ml-10 mr-10'>
        { isHome ? (
            <>
        <Link className="rounded-4xl w-auto bg-[#df4e87] pt-1 pb-1 pl-5 pr-5 border-solid border-1 border-black" to="/login">Login</Link>
        <Link className="rounded-4xl w-auto bg-[#68bfec] pt-1 pb-1 pl-5 pr-5 border-solid border-1 border-black" to="/signup">Sign Up</Link> 
        </>) : (
            <>
            <Link className="rounded-4xl w-auto bg-[#68bfec] pt-1 pb-1 pl-20 pr-20 mr-10 ml-20 border-solid border-1 border-black" to='/'>Home</Link>
            </>
        )
        
        }
       </div>
    </nav>
  )
}

export default NavBar