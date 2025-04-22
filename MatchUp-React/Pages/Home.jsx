import React from 'react';
import NavBar from '../Components/NavBar';

const Home = () => {
  return (
    <div id="home" className="flex flex-col min-h-screen w-full bg-white">
      <NavBar isHome={true} />

      <div className="flex justify-center items-center p-6">
        <img
          src="logobig.png"
          alt="flower"
          className="w-40 md:w-60 object-contain"
        />
      </div>

     
      <div className="flex flex-col items-center justify-center gap-4 text-center px-4">
  <h1 className="text-xl md:text-4xl text-blue-800 tracking-wide font-stretch-50% underline">
    Find Your Real Connections
  </h1>

  <img
    src="text.png"
    alt="bgoftexting"
    className="w-64 md:w-96 object-contain mt-2"
  />
</div>
    </div>
  );
};

export default Home;
