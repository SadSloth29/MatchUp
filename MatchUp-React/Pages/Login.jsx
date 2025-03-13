import React from 'react'
import NavBar from '../Components/NavBar'
import { useParams,Link,useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react'

const Login = () => {
  const {type}=useParams();
  const [isSignUp, setIsSignUp] = useState(false); 
  const navigate=useNavigate();
  useEffect(()=>{
    setIsSignUp(type==='signup');
  },[type]);
  console.log(isSignUp);
  return (
    <div id='login' className='flex flex-col items-center h-screen w-screen bg-cover bg-center bg-no-repeat'>
    <NavBar isHome={false} />
    <h2 className="text-2xl font-bold mb-4 text-[#e97ca3]">{isSignUp?"Sign Up":"Login"}</h2>
    <div id='main-section'>
      <form>
        
      </form>
    </div>
    </div>
  )
}

export default Login