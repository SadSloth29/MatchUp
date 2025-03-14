import React from 'react'
import NavBar from '../Components/NavBar'
import { useParams,Link,useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react'

const Login = () => {
  const navigate=useNavigate();

  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(isSignUp){
    const response=await fetch("http://localhost/ProjectMatchUp/API/signup.php",{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username,email,password,gender,age,interested,bio}),

} );
  const result=await response.json();
  if(result.success){
    setEmail("");
    setPassword("");
    navigate("/login");
  }

  setMessage(result.message || result.error);
}
    else if(!isSignUp){
      const response=await fetch("http://localhost/ProjectMatchUp/API/login.php",{
      method: "POST",
      headers: {"Content-Type":"application/x-www-form-urlencoded"},
      body: new URLSearchParams({email,password}),

    });
    const result=await response.json();
    if (result.success) {
      setUserId(result.user_id);
      setShowOtpField(true);
      alert("OTP sent to your email");
    } else {
      alert(result.error);
    }

    }
}
   




  const {type}=useParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [gender, setGender] = useState("");
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [age,setAge]=useState("");
  const [city,setCity]=useState("");
  const [country,setCountry]=useState("");
  const [interested,setInterested]=useState("");
  const [bio,setBio]=useState("");
  const [message,setMessage]=useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");

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
      <form  onSubmit={handleSubmit} method='post' name='registration' className='flex flex-col justify-start items-center rounded-3xl p-10 m-10 mt-4 bg-[#ffffff]'>
        {isSignUp && (<div className='flex align-middle items-center gap-4 m-2'>
          <label for="username">User Name:</label>
          <input required value={username} onChange={(e)=>setUsername(e.target.value)}className="bg-[#fec7ff] rounded-2xl border-1 border-solid border-black p-1"type='text' name='username' id="username" placeholder='Sadman..'></input>
          
        </div>)}
        {!showOtpField && (
        <div className='flex align-middle items-center gap-4 m-2'>
          <label for="email">Email</label>
          <input required value={email} onChange={(e)=>setEmail(e.target.value)} className="bg-[#fec7ff] rounded-2xl border-1 border-solid border-black p-1" type='email' name='email' id="email" placeholder='sadman@gmail.com'></input>
          <label for="password">Password</label>
          <input required value={password} onChange={(e)=>setPassword(e.target.value)} className="bg-[#fec7ff] rounded-2xl border-1 border-solid border-black p-1" type='password' name='password' id="password"></input>
        </div>)
        }
        {!isSignUp && showOtpField && (
        <div>
          <input className="bg-[#fec7ff] rounded-2xl border-1 border-solid border-black p-1" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
          <button className='text-white w-24 h-8 rounded-2xl bg-gradient-to-b from-[#6c5fd4] to-[#797988] border-1 border-solid border-black' onClick={verifyOtp}>Submit</button>
        </div>
        )}
        
        {isSignUp && (
          <div className='flex flex-col gap-2'>
            <div className='flex align-baseline items-center gap-4 m-2 mr-4'>
            <label for='age'>Age:</label>
            <input required value={age} onChange={(e)=>setAge(e.target.value)} className="bg-[#c8ecea] rounded-2xl border-1 border-solid border-black p-1" type='text' name='age' id="age"></input>
            <label for='gender'>Gender</label>
            <select
               id="gender"
               name="gender"
               value={gender}
               onChange={(e) => setGender(e.target.value)}
               className="bg-[#c8ecea] rounded-2xl border-1 border-solid border-black p-2 mr-2"
               required
            >
            <option value="" disabled>Select your gender:</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
             </select>
             </div>
             <div className='flex align-baseline items-center gap-4 m-2 mr-4'>
              <label for="city">City:</label>
             <input value={city} onChange={(e)=>setCity(e.target.value)} className="bg-[#dfdcf7] rounded-2xl border-1 border-solid border-black p-1"type='text' name='city' id='city'></input>
             <label for="country">Country:</label>
             <input value={country} onChange={(e)=>setCountry(e.target.value)} className="bg-[#dfdcf7] rounded-2xl border-1 border-solid border-black p-1"type='text' name='country' id='country'></input>
             </div >
             <div className='flex align-baseline items-center gap-4 m-2 mr-4'>
             <label className="self-start m-2 mr-0 ml-0" for='interested_in'>Interested In:</label>
             <input value={interested} onChange={(e)=>setInterested(e.target.value)} className='flex align-baseline items-center gap-4 m-1 ml-0 mr-4 bg-[#dfdcf7] rounded-2xl border-1 border-solid border-black p-1' type='text' name='interested_in' id='interested_in'></input>
             </div>
             <label className="self-start m-1" for='bio'>Bio:</label>
             <input value={bio} onChange={(e)=>setBio(e.target.value)} className='h-10 flex align-baseline items-center gap-4 m-1 mt-0 mr-2 bg-[#dfdcf7] rounded-2xl border-1 border-solid border-black p-1' type='text' name='bio' id='bio'></input>
          </div>
        )}
        <div className='flex flex-col justify-center items-center mt-4 mb-0'>
        {!showOtpField && (
        <button type='submit' name='submit' className='text-white w-24 h-8 rounded-2xl bg-gradient-to-b from-[#6c5fd4] to-[#797988] border-1 border-solid border-black'>{isSignUp?"Sign Up":"Login"}</button>
        )
        }
        {message && <p className='mt-4 text-red-500'>{message}</p>}
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