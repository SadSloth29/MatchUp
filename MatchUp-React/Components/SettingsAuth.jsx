import React, { useState,useEffect } from 'react'
import { Navigate,Outlet, useNavigate } from 'react-router-dom';

const SettingsAuth = () => {
  const [username,setUsername]=useState("");
  const [isAuthenticated,setIsAuthenticated]=useState(null);
  const [password,setPassword]=useState("");
  const [userInfo,setUserInfo]=useState({})
  const navigate=useNavigate();
  const handleAuth=async ()=>{
    try{
    const response=await fetch("http://localhost/ProjectMatchUp/API/settings.php",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            username: username,
            password: password,
            option: "AUTH"
        })});
    const result=await response.json();
    
    if(result.success){

        setIsAuthenticated(true);
        try{
            
            
            const response2=await fetch("http://localhost/ProjectMatchUp/API/settings.php",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    username: username,
                    option: "FETCH"
                })});
            const info=await response2.json();
            if(info.success){
                console.log(info.info);
                setUserInfo(info.info);
                setIsAuthenticated(true);
                
            }
            else{
                setIsAuthenticated(false);
                console.error("Could not confirm Authentication",info.error);
            }
        }catch(error){
            console.error("Could not fetch posts",error);
        }
    }
   }catch(error){
    console.error("Could not make request",error);
   }
  }
   useEffect(() => {
          const checkAuth = async () => {

            const response = await fetch("http://localhost/ProjectMatchUp/Core/checksession.php", {
              method: "GET",
              credentials: "include",
            });
            const result = await response.json();
            if(result.success){
            setUsername(result.username);
            
          }
            
          };
          
          
          checkAuth();
        }, []);
  if(isAuthenticated===null){
  return (
    <div className='flex flex-col justify-center items-center bg-pink-200 w-screen h-screen'>
        <div className=' flex flex-col w-auto h-auto p-5 border-2 border-black'>
            <h2>Please Confirm Password</h2>
            <input  className='w-auto h-auto m-5 p-1 bg-white'type='password' value={password} onChange={(e)=>setPassword(e.target.value)}></input>
            <button className='w-auto h-auto border-1 border-black bg-blue-500 p-2'onClick={handleAuth}>Submit</button>
        </div>
    </div>
  )
}return isAuthenticated ? <Outlet context={{ userInfo }} /> : <Navigate to="/login" replace />;
}

export default SettingsAuth