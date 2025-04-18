import React from 'react'
import NavBar from '../Components/NavBar'
const Home = () => {
  return (
    <div id='home' className='flex flex-col h-screen w-screen bg-gradient-to-b from-pink-200 to-white'>
    <NavBar isHome={true}/>
    <div className='flex justify-center items-center p-4 text-[#eb4c7b]'>
        <h1 className='text-5xl'>
            <span>Find Your </span>
            <span id='cursive-writing'>Real Connections</span>
        </h1>
    </div>
    <div className='flex justify-center items-center p-2'>
        <img className="object-fill max-w-1/4 self-start justify-self-start"src='heart.png' alt='flower'></img>
        <img src='BG.png' alt='bgoftexting'></img>
        <img className="object-fill max-w-1/6 self-end justify-self-end"src='heart.png' alt='flower'></img>
    </div>
    </div>
  )
}

export default Home