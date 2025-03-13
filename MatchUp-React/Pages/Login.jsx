import React from 'react'
import NavBar from '../Components/NavBar'
import { useParams,Link,useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react'

const Login = () => {
  const {type}=useParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [gender, setGender] = useState("");
  
  useEffect(()=>{
    setIsSignUp(type==='signup');
  },[type]);
  console.log(isSignUp);
  return (
    <div id='login' className='flex flex-col items-center h-screen w-screen bg-cover bg-center bg-no-repeat'>
    <NavBar isHome={false} />
    <h2 className="text-2xl font-bold mb-4  text-[#e97ca3]">{isSignUp?"Sign Up":"Login"}</h2>
    <div id='main-section' className='flex gap-6'>
      <div id='form-holder' className='flex flex-col'>
      <form method='post' name='registration' className='flex flex-col justify-start items-center rounded-3xl p-10 m-10 mt-4 bg-[#ffffff]'>
        {isSignUp && (<div className='flex align-middle items-center gap-4 m-2'>
          <label for="firstname">First Name:</label>
          <input className="bg-[#fec7ff] rounded-2xl border-1 border-solid border-black p-1"type='text' name='firstname' placeholder='Sadman..'></input>
          <label for="lastname">Last Name:</label>
          <input className="bg-[#fec7ff] rounded-2xl border-1 border-solid border-black p-1" type='text' name='lastname'  placeholder='Hasan..'></input>
        </div>)}
        <div className='flex align-middle items-center gap-4 m-2'>
          <label for="email">Email</label>
          <input className="bg-[#fec7ff] rounded-2xl border-1 border-solid border-black p-1" type='email' name='email' placeholder='sadman@gmail.com'></input>
          <label for="password">Password</label>
          <input className="bg-[#fec7ff] rounded-2xl border-1 border-solid border-black p-1" type='password' name='password'></input>
        </div>
        {isSignUp && (
          <div className='flex flex-col gap-2'>
            <div className='flex align-baseline items-center gap-4 m-2 mr-4'>
            <label for='age'>Age:</label>
            <input className="bg-[#c8ecea] rounded-2xl border-1 border-solid border-black p-1" type='text' name='age'></input>
            <label for='gender'>Gender</label>
            <select
               id="gender"
               value={gender}
               onChange={(e) => setGender(e.target.value)}
               className="bg-[#c8ecea] rounded-2xl border-1 border-solid border-black p-2 mr-2"
            >
            <option value="" disabled>Select your gender:</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
             </select>
             </div>
             <div className='flex align-baseline items-center gap-4 m-2 mr-4'>
              <label for="city">City:</label>
             <input className="bg-[#dfdcf7] rounded-2xl border-1 border-solid border-black p-1"type='text' name='city'></input>
             <label for="country">Country:</label>
             <input className="bg-[#dfdcf7] rounded-2xl border-1 border-solid border-black p-1"type='text' name='country'></input>
             </div >
             <div className='flex align-baseline items-center gap-4 m-2 mr-4'>
             <label className="self-start m-2 mr-0 ml-0" for='interested_in'>Interested In:</label>
             <input className='flex align-baseline items-center gap-4 m-1 ml-0 mr-4 bg-[#dfdcf7] rounded-2xl border-1 border-solid border-black p-1' type='text' name='interested_in'></input>
             </div>
             <label className="self-start m-1" for='bio'>Bio:</label>
             <input className='h-10 flex align-baseline items-center gap-4 m-1 mt-0 mr-2 bg-[#dfdcf7] rounded-2xl border-1 border-solid border-black p-1' type='text' name='bio'></input>
          </div>
        )}
        <div className='flex flex-col justify-center items-center mt-4 mb-0'>
        <button type='submit' name='submit' className='text-white w-24 h-8 rounded-2xl bg-gradient-to-b from-[#6c5fd4] to-[#797988] border-1 border-solid border-black'>{isSignUp?"Sign Up":"Login"}</button>
        <p className='mb-0 mt-2 self-start'>{isSignUp ? (
          <>
            Already Have An Account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </>
        ) : (
          <>
            Don't Have An Account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </>
        )}</p>
        </div>
        
      </form>
      </div>
      <div>
        <img src='BG.png' alt='side-image'></img>
      </div>
    </div>
    </div>
  )
}

export default Login