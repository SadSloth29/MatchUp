import React, { useState } from 'react'

const SettingsAuth = () => {
  const [username,setUsername]=useState("");
  const [isAuthenticated,setIsAuthenticated]=useState(null);
  const [password,setPassword]=useState("");
  const [userInfo,setUserInfo]=useState({});
  const handleAuth=async ()=>{
    try{
    const response=await fetch("http://localhost/ProjectMatchUp/API/settings.php",{
        method: "POST",
        body: JSON.stringify({
            username: username,
            password: password,
            option: "AUTH"
        })});
    const result=await response.json();
    if(result.success){
        try{
            const response2=await fetch("http://localhost/ProjectMatchUp/API/settings.php",{
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    option: "FETCH"
                })});
            const info=await response2.json();
            if(info.success){
                setUserInfo(info.info);
                setIsAuthenticated(true);
            }
            else{
                setIsAuthenticated(false);
            }
        }catch(error){
            console.error("Could not fetch posts",error);
        }
    }
   }catch(error){}
  }
   useEffect(() => {
          const checkAuth = async () => {
            const response = await fetch("http://localhost/ProjectMatchUp/Core/checksession.php", {
              method: "GET",
              credentials: "include",
            });
            const result = await response.json();
            if(result.success)
            setUsername(result.username);
            
          };
          
          checkAuth();
        }, []);
  if(isAuthenticated===null){
  return (
    <div className='flex flex-col justify-center items-center bg-pink-200 w-full h-full'>
        <div className=' flex flex-col w-auto h-auto p-5 border-2 border-black'>
            <h2>Please Confirm Password</h2>
            <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}></input>
            <button className='w-5 h-5 border-1 border-black bg-blue-500 p-2'onClick={handleAuth}>Submit</button>
        </div>
    </div>
  )
}return isAuthenticated ? <Outlet info={info}/> : <Navigate to="/login" replace />;
}

export default SettingsAuth