import React, { useEffect, useState } from 'react'
import NavProfile from "../Components/NavProfile"
import { useNavigate, useParams,Link} from 'react-router-dom'
import ShowPosts from '../Components/ShowPosts'
import PfpUploadPop from '../Components/PfpUploadPop'
const UserProfile = () => {
  const {username}=useParams();
  const [loggedUser,setLoggedUser]=useState("");
  const [isOwner,setIsOwner]=useState(false);
  const [followed,setFollowed]=useState(false);
  const [info, setInfo] = useState([]);
  const [user,setUser]=useState("");
  const [showModal, setShowModal] = useState(false);
  const [isBlocked,setisBlocked]=useState(null);
  
  const navigate=useNavigate();

  

  const handleBlock=async ()=>{
    try{
      const response=await fetch(`http://localhost/ProjectMatchUp/API/block.php`,
        {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          credentials: "include",
          body: JSON.stringify({
            username: username,
            blocked_by: loggedUser,
            action: "insert"
          })
        });
      const result=await response.json();
      if(!result.success){
        console.error("Could not finish block request",result.error);
      }
    }catch(error){
      console.error("Could not connect to server",error);
    }
  }

  const handleUpload= async (newImageURL)=>{

    if(!newImageURL) return;
    try{
      const response=await fetch(`http://localhost/ProjectMatchUp/API/UpdatePfp.php`,
        {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          credentials: "include",
          body: JSON.stringify({
            username: username,
            profile_pic: newImageURL
          })
        });
      const result=await response.json();
      
      if (!result.success) {
        console.error("Failed to update profile picture:", result.error);
      }
    }catch(error){
      console.error("Error updating profile pic",error);
    }
  }

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
    
    
    checksession();
    
    
    
  },[username]);
  useEffect(()=>{
    const fetchInfo=async ()=>{
      try{
        const response=await fetch("http://localhost/ProjectMatchUp/API/getUserInfo.php",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify({
            username: username,
            checking: loggedUser,
          }),
        });
        const result=await response.json();

        if(result.success){
          setInfo(result.info);
          setUser(result.info.username);
          
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
    };
    const blocked=async ()=>{
      try{
        const response=await fetch(`http://localhost/ProjectMatchUp/API/block.php`,
          {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            credentials: "include",
            body: JSON.stringify({
              username: username,
              blocked_by: loggedUser,
              action: "check"
            })
          });
          const result=await response.json();
          if(result.success){
            setisBlocked(result.info);
            console.log(result.info);
          }
      }catch(error){
        console.error("could not check blocked status",error);
      }
    }
    
    blocked();
    fetchInfo(); 
       
  },[username,loggedUser]);

 

  if(isBlocked && (isBlocked.blocked1===1 || isBlocked.blocked2===1)){
    return(
      <div className='w-screen h-screen bg-pink-200 flex flex-col justify-center items-center'>
        <img src='/cat.png' className='object-contain w-1/4 h-1/4'></img>
        <h2>Could not find this user. Press below to return to your feed</h2>
        <Link to={`/profile/${loggedUser}`}>Back To Profile</Link>
      </div>
    )
  }

  
  
  return (
    <div className='flex flex-col gap-0 m-0'>
        <NavProfile username={username}/>
        
        <div>
            {info[0]?(
             <div>
            <div className='flex flex-col items-center justify-end bg-gradient-to-b from-pink-200 to-white max-w-screen h-52 border-4 border-black'>
            <img src={info[0].img? info[0].img:"/user.png"} className='object-fill h-30 w-30 rounded-full border-1 border-black mb-1'  alt='profilepic'></img>
            {isOwner && (<button onClick={() => setShowModal(true)} className='rounded-2xl absolute m-2 p-1 self-end right-1/3 border-3 border-black w-auto h-auto bg-gradient-to-b from-pink-400 to-white'>Update Image</button>)}
            {showModal && isOwner && <PfpUploadPop onclose={() => setShowModal(false)} onUpload={handleUpload} />}
            <p id="profile_name" className='m-0'>{info[0].username}</p>
            {!isOwner && (<button onClick={handleFollow} className='rounded-2xl absolute m-2 p-1 self-end right-1/3 border-3 border-black w-auto h-auto bg-gradient-to-b from-pink-400 to-white'>{followed? "Unfollow":"Follow"}</button>)}
            {!isOwner && (<button onClick={handleBlock} className='rounded-2xl absolute right-1/4 m-2 p-1 self-end border-black border-3 w-auto h-auto bg-red-600'>Block</button>)}
            </div>
            <div className='flex bg-pink-200 max-w-screen h-screen'>
               <div className='flex flex-col gap-5 m-5'>
               <div className='flex flex-col gap-7 bg-cyan-50 w-auto h-auto p-4 m-5 mb-2 border-2 border-black rounded-2xl'> 
                  <h3 className='self-center underline'>Profile Details</h3>
                  <div className='flex justify-evenly'>
                    <p className='profile_info'>Age:{info[0].age} </p><p className='profile_info'>Gender:{info[0].gender}</p>
                  </div>
                  <div className='flex justify-evenly gap-2'>
                    <p className='profile_info'>City:Dhaka </p><p className='profile_info'> Country:Bangladesh </p>
                  </div>
                  <div className='flex justify-center'>
                    <p className='profile_info'>Bio:{info[0].bio}</p>
                  </div>
               </div>
               <div className='flex flex-col gap-2 bg-cyan-50 w-auto h-auto p-4 m-5 border-2 border-black rounded-2xl'> 
                  <h3 className='self-center underline'>Preference</h3>
                  <div className='flex justify-between self-center'>
                    <p className='profile_info'>Personality:{info[0].pers}</p>
                  </div>
                  <div className='flex justify-between self-center'>
                    <p className='profile_info'>Distance:{info[0].md}KM</p>
                  </div>
                  
               </div>
               </div> 
               <ShowPosts username={username} location={"profile"}/>
            </div>
            </div>
            ):(<p>Waiting</p>)}
        </div>
    </div>
  )
}

export default UserProfile