import React, { useEffect, useState } from 'react'
import NavProfile from "../Components/NavProfile"
import { useNavigate, useParams } from 'react-router-dom'
import ShowPosts from '../Components/ShowPosts'
const UserProfile = () => {
  const {username}=useParams();
  const [loggedUser,setLoggedUser]=useState("");
  const [isOwner,setIsOwner]=useState(false);
  const [followed,setFollowed]=useState(false);
  const [info,setInfo]=useState([]);
  
  const navigate=useNavigate();

  const handleFollow=async ()=>{

    setFollowed(!followed);
    try{
      const response=await fetch(`http://localhost/ProjectMatchUp/API/handleFollow.php`,{
        method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            credentials: "include",
            body: JSON.stringify({
                profile: username,
                action: followed ? "unfollow" : "follow",
                follower: loggedUser 
      })});
      const result=await response.json();

      if(!result.success){
        console.error(result.error);
      }


    }catch(error){
      console.error("Error handling Follow",error)
    }
  }

  useEffect(()=>{
    const checksession=async ()=>{
        try{
        const response=await fetch("http://localhost/ProjectMatchUp/Core/checksession.php",{
            method: "GET",
            credentials: "include"
        });
        const result=await response.json();

        if(result.success){
            setLoggedUser(result.username);
            setIsOwner(result.username===username);
        }
        }catch(error)
        {
            console.error('Error Checking Session',error);
        }
    };
    const fetchInfo=async ()=>{
      try{
        const response=await fetch("http://localhost/ProjectMatchUp/API/getUserInfo",{
              method:"POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                username:username,
                checking: loggedUser
              })
        });
        const result=await response.json();

        if(result.success){
          setInfo(result.info);

          if(info.follow==0){
            setFollowed(false);
          }
          else{
            setFollowed(true);
          }
        }
        else{
          console.error(result.error);
        }
      }catch(error){
         console.error("Error fetching user info",error);
      }
    }    
    
    checksession();
    fetchInfo();
    
  },[username]);
  return (
    <div className='flex flex-col gap-0 m-0'>
        <NavProfile username={username}/>
        <div>
            <div className='flex flex-col items-center justify-end bg-gradient-to-b from-pink-200 to-white max-w-screen h-52 border-4 border-black'>
            <img src={info.username? info.username:"/user.png"} className='object-fill h-30 w-30 rounded-full border-1 border-black mb-1'  alt='profilepic'>
            {isOwner && (<button>Update Image</button>)}</img>
            <p id="profile_name" className='m-0'>Pugu</p>
            {!isOwner && (<button onClick={handleFollow} className='rounded-2xl absolute m-2 p-1 self-end right-1/3 border-3 border-black w-auto h-auto bg-gradient-to-b from-pink-400 to-white'>{followed? "Unfollow":"Follow"}</button>)}
            </div>
            <div className='flex bg-pink-200 max-w-screen h-screen'>
               <div className='flex flex-col gap-5 m-5'>
               <div className='flex flex-col gap-7 bg-cyan-50 w-1/2 h-auto p-4 m-5 mb-2 border-2 border-black rounded-2xl'> 
                  <h3 className='self-center underline'>Profile Details</h3>
                  <div className='flex justify-evenly'>
                    <p className='profile_info'>Age:20 </p><p className='profile_info'>Interested In:Male </p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='profile_info'>City:Dhaka </p><p className='profile_info'>Country:Bangladesh </p>
                  </div>
                  <div className='flex justify-center'>
                    <p className='profile_info'>Bio:Meow Meow Meow I am cat woman queen belong to queen eva</p>
                  </div>
               </div>
               <div className='flex flex-col gap-2 bg-cyan-50 w-1/2 h-auto p-4 m-5 border-2 border-black rounded-2xl'> 
                  <h3 className='self-center underline'>Preference</h3>
                  <div className='flex justify-between self-center'>
                    <p className='profile_info'>Personality: Introvert</p>
                  </div>
                  <div className='flex justify-between self-center'>
                    <p className='profile_info'>Distance:10km</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='profile_info'>City:Dhaka </p><p className='profile_info'>Country:Bangladesh </p>
                  </div>
                  
               </div>
               </div> 
               <ShowPosts username={username} location={"profile"}/>
            </div>
            
        </div>
    </div>
  )
}

export default UserProfile