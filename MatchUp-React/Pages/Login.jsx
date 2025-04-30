import React, { useEffect, useState } from 'react';
import NavBar from '../Components/NavBar';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [interested, setInterested] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');

  const getCoordinates = async (city, country) => {
    const apikey = '6f896ea6bab3be3e7c423568b88969ec';
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${apikey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: lat, longitude: lon };
      } else {
        alert('Location not found.');
        return null;
      }
    } catch (error) {
      console.error('Geo error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      const location = await getCoordinates(city, country);
      if (!location) return;

      const response = await fetch("http://localhost/ProjectMatchUp/API/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username, email, password, gender, age, interested, bio, city, country,
          lat: location.latitude, lon: location.longitude
        })
      });

      const result = await response.json();
      if (result.success) {
        setEmail("");
        setPassword("");
        navigate("/login");
      }else{
        alert(result.error);
      }
      setMessage(result.message || result.error);
    } else if (!isLoggedIn && !isSignUp) {
      const response = await fetch("http://localhost/ProjectMatchUp/API/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (result.success) {
        setEmail(result.email);
        setShowOtpField(true);
        alert("OTP sent to your email");
      } else {
        alert(result.error);
      }
    }
  };

  const verifyOtp = async () => {
    const response = await fetch("http://localhost/ProjectMatchUp/API/verify_otp.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    });
    const result = await response.json();
    if (result.success) {
      alert("Login successful!");
      setIsLoggedIn(true);
      setShowOtpField(false);
      setEmail("");
      navigate(`/users/${result.username}`);
    } else {
      alert(result.error);
    }
  };

  useEffect(() => {
    setIsSignUp(type === 'signup');
    const checkSession = async () => {
      const response = await fetch('http://localhost/ProjectMatchUp/Core/checksession.php', {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        setIsLoggedIn(true);
        setUsername(result.username);
        if (window.location.pathname !== `/users/${result.username}`) {
          navigate(`/users/${result.username}`);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, [type, navigate]);

  return (
    <div className='min-h-screen bg-blue-900 text-white'>
      <NavBar isHome={false} />
      <div className='flex flex-col justify-center items-center py-8'>
        <h2 className='text-3xl font-semibold text-blue-100 mb-6'>
          {isSignUp ? "Sign Up" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className='bg-blue-800 p-6 rounded-2xl shadow-md w-full max-w-md space-y-4'>
          {isSignUp && (
            <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className='w-full p-2 rounded bg-blue-100 text-black placeholder-gray-600' required />
          )}
          {!showOtpField && (
            <>
              <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full p-2 rounded bg-blue-100 text-black placeholder-gray-600' required />
              <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full p-2 rounded bg-blue-100 text-black placeholder-gray-600' required />
            </>
          )}
          {showOtpField && (
            <div className='flex gap-2'>
              <input type='text' placeholder='Enter OTP' value={otp} onChange={(e) => setOtp(e.target.value)} className='w-full p-2 rounded bg-blue-100 text-black' />
              <button type='button' onClick={verifyOtp} className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'>Submit</button>
            </div>
          )}
          {isSignUp && (
            <>
              <input type='number' placeholder='Age' value={age} onChange={(e) => setAge(e.target.value)} className='w-full p-2 rounded bg-blue-100 text-black placeholder-gray-600' required />
              <select value={gender} onChange={(e) => setGender(e.target.value)} className='w-full p-2 rounded bg-blue-100 text-black' required>
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input type='text' placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} className='w-full p-2 rounded bg-blue-100 text-black placeholder-gray-600' />
              <input type='text' placeholder='Country' value={country} onChange={(e) => setCountry(e.target.value)} className='w-full p-2 rounded bg-blue-100 text-black placeholder-gray-600' />
              <input type='text' placeholder='Interested In' value={interested} onChange={(e) => setInterested(e.target.value)} className='w-full p-2 rounded bg-blue-100 text-black placeholder-gray-600' />
              <textarea placeholder='Bio' value={bio} onChange={(e) => setBio(e.target.value)} className='w-full p-2 rounded bg-blue-100 text-black placeholder-gray-600' />
            </>
          )}

          {!showOtpField && (
            <button type='submit' className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded'>
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          )}

          {message && <p className='text-red-300 text-sm text-center'>{message}</p>}

          <div className='text-center mt-4'>
            {(!showOtpField && isSignUp) ? (
              <>
                Already have an account? <Link to="/login" className='text-blue-300 hover:underline'>Login</Link>
              </>
            ) : (
              <>
              {!showOtpField &&
              (<>
                Don't have an account? <Link to="/signup" className='text-blue-300 hover:underline'>Sign Up</Link>
              </>)}
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
