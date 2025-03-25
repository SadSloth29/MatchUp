import React, { useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import NavProfile from "../Components/NavProfile";
const Settings = () => {
  const {username}=useParams();
  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const [city,setCity]=useState();
  const [country,setCountry]=useState();
  const [personality,setPersonality]=useState();
  const [matchDistance,setMatchDistance]=useState();
  return (
    <div className='flex flex-col gap-2'>
        <NavProfile username={username}></NavProfile>
        <div>
            <div>
                <h2>User Settings</h2>
                <div>
                    <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)}></input>
                    <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}></input>
                </div>
            </div>
            <div>
                <h2>Profile Settings</h2>
                <div>
                    <input type='text'></input>
                    <input type='text'></input>
                </div>
            </div>
            <div>
                <h2>Preference Settings</h2>
                <input type='text'></input>
                <input type='number'></input>
            </div>
        </div>
    </div>
  )
}

export default Settings