import React, { useEffect, useState } from 'react'
import { useParams, useNavigate} from "react-router-dom";
import NavProfile from "../Components/NavProfile";
const Settings = () => {
  const navigate=useNavigate();
  
  const {username}=useParams();
  const [loggedUser,setLoggedUser]=useState("");
  const [email,setEmail]=useState("");
  const [bio,setBio]=useState("");
  const [password,setPassword]=useState("");
  const [city,setCity]=useState("");
  const [country,setCountry]=useState("");
  const [userInfo,setUserInfo]=useState(null);
  const [newPassword,setNewPassword]=useState("");
  const [personality,setPersonality]=useState("");
  const [match_distance,setMatch_distance]=useState(null);
  const [mesage,setMessage]=useState("");

  const getCoordinates= async (city,country)=>{
    const apikey="6f896ea6bab3be3e7c423568b88969ec";
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${apikey}`;

    try{
       const response=await fetch(url);
       const data=await response.json();
       if(data.length>0){
           const {lat,lon}=data[0];
           return {latitude:lat,longitude:lon};
       }else{
           console.error("location not found");
           return null;
       }
    }catch(error){
       console.error("Could not complete request",error);
    }
}
  const handleSubmit= async (action)=>{

    const updatedInfo={};
    if(email!==userInfo.email)updatedInfo.email=email;
    else updatedInfo.email=userInfo.email;
    if(personality!==userInfo.personality)updatedInfo.personality=personality;
    else updatedInfo.personality=userInfo.personality;
    if(match_distance!==userInfo.match_distance)updatedInfo.match_distance=match_distance;
    else updatedInfo.match_distance=userInfo.match_distance;
    if(bio!==userInfo.bio)updatedInfo.bio=bio;
    else updatedInfo.bio="";
    if(city!==userInfo.city)updatedInfo.city=city;
    else updatedInfo.city=""
    if(country!==userInfo.country)updatedInfo.country=country;
    else updatedInfo.country=userInfo.country;
    updatedInfo.password=newPassword;

    if(action==="user"){
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
        setMessage("");
        try{
          const response2=await fetch("http://localhost/ProjectMatchUp/API/updateSettings.php",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                username:username,
                email: updatedInfo.email,
                password: newPassword.length>0?updatedInfo.password:password,
                option: "user"
            })});
          
            const info=await response2.json();
            if(info.success){
              alert("Updated User Settings");
              setEmail("");
              setPassword("");
              setNewPassword("");
              
            }

        }catch(error){
        console.error("Could not Update User Settings",error);
        }
      }else if(!result.success && password.length>0){setMessage("verify current password to change user settings")}
      else{
         setMessage(result.error);
      }
      }catch(error){
        console.error("Could not Authenticate Password",error);
      }
    }
    if(action==='profile'){
      let location=getCoordinates(updatedInfo.city,updatedInfo.country);
      try{

        const response=await fetch("http://localhost/ProjectMatchUp/API/updateSettings.php",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
              username:username,
              city: updatedInfo.city,
              country: updatedInfo.country,
              bio: updatedInfo.bio,
              lat:location.latitude,
              lon:location.longitude,
              option: "profile"
          })});
        
          const info=await response.json();
          if(info.success){
            alert("Updated User Settings");
            setCity("");
            setCountry("");
            setBio("");
            
          }

      }catch(error){
        console.error("Could not update settings",error);
      }
    }
    if(action==='preference'){
      try{

        const response=await fetch("http://localhost/ProjectMatchUp/API/updateSettings.php",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
              username:username,
              personality: updatedInfo.personality,
              match_distance: updatedInfo.match_distance,
              option: "preference"
          })});
        
          const info=await response.json();
          if(info.success){
            alert("Updated User Settings");
            setPersonality("");
            setMatch_distance("");
            
            
          }

      }catch(error){
        console.error("Could not update settings",error);
      }
    }
  }
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost/ProjectMatchUp/Core/checksession.php",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await response.json();
        if (result.success) {
          setLoggedUser(result.username);
          if (result.username !== username) {
            navigate(`/settings/${result.username}`);
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          "http://localhost/ProjectMatchUp/API/settings.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              username: username,
              option: "FETCH",
            }),
          }
        );
        const info = await response.json();
  
        if (info.success) {
          setUserInfo(info.info);
          setEmail(info.info.email);
          setPersonality(info.info.personality);
          setMatch_distance(info.info.match_distance);
          setBio(info.info.bio);
          setCity(info.info.city);
          setCountry(info.info.country);
        } else {
          console.error("Could not fetch user info:", info.error);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    checkAuth();
    fetchUserInfo();
  }, [username, navigate]);

  

  if (!userInfo) {
    return (
      <div className="flex flex-col justify-center w-screen h-screen items-center bg-pink-300 text-white">
        <h1>LOADING....</h1>
      </div>
    );
  }
  
  
  return (
    <div className="flex flex-col gap-2 h-auto bg-pink-200" id='settings'>
      <NavProfile username={username} />
      <div className='flex flex-col justify-center items-center gap-4 border-4 border-black rounded-2xl p-4'>
        <h2 className='underline'>User Settings</h2>
        <div className='flex flex-col w-auto h-auto bg-white p-2 border-2 border-black rounded-2xl'>
        <div className='flex gap-2'>
          <h4>Email:</h4>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            name='email'
          />
          <h4>Old Password:</h4>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Current Password"
          />
        </div>
        <div className='flex gap-2'>
        <h4>New Password:</h4>
        <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
          />
        </div>
        </div>
        <button className='w-auto h-10 bg-blue-500 p-1 border-2 border-black' onClick={()=>handleSubmit('user')}>Update User Settings</button>
        <h2>{mesage}</h2>
        <h2 className='underline'>Profile Settings</h2>
        <div className='flex w-auto h-auto bg-white p-2 border-2 border-black rounded-2xl gap-2'>
          <h4>City: </h4>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
          <h4>Country: </h4>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
          <h4>Bio: </h4>
          <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Country" />
        </div>
        <button className='w-auto h-10 bg-blue-500 p-1 border-2 border-black' onClick={()=>handleSubmit('profile')}>Update Profile Settings</button>
        <h2 className='underline'>Preference Settings</h2>
        <div className='flex w-auto h-auto bg-white p-2 border-2 border-black rounded-2xl gap-2'>
        <h4>Personality: </h4>
        <input type="text"  value={personality} onChange={(e)=>setPersonality(e.target.value)}/>
        <h4>Match Distance: </h4>
        <input type="number" value={match_distance} onChange={(e)=>setMatch_distance(e.target.value)}/>
        </div>
        <button className='w-auto h-10 bg-blue-500 p-1 border-2 border-black' onClick={()=>handleSubmit('preference')}>Update Preference Settings</button>
        <button className='w-auto h-10 bg-red-500 border-2 border-black'>Delete Account</button>
      </div>
    </div>
  )
}

export default Settings