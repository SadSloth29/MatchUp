import React, { useEffect, useState } from 'react'
import { useParams,Link } from 'react-router-dom';
import NavProfile from './NavProfile';
const ShowFollowBlocked = () => {

  const [sorting,setSorting]=useState("A-Z");
  const [isFollow,setIsFollow]=useState(false);
  const [loggedUser,setLoggedUser]=useState("");
  const [followers,setFollowers]=useState([]);
  const [following,setFollowing]=useState([]);
  const [blocked,setBlocked]=useState([]);
  const { type } = useParams();
  const handleRemove= async (username,action)=>{
     if(action==='follower' && isFollow){
      try{
        
          const response=await fetch(`http://localhost/ProjectMatchUp/API/handleFollow.php`,{
            method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                credentials: "include",
                body: JSON.stringify({
                    profile: loggedUser,
                    action: "unfollow",
                    follower: username 
          })});
          const result=await response.json();
          if(result.success){
            console.log("Removed from followers");
          }
      
     }catch(error){
      console.error("Could not request remove follower",error);
     }
    }
    else if(action==='follower' && !isFollow){
      try{
        const response=await fetch(`http://localhost/ProjectMatchUp/API/block.php`,
          {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            credentials: "include",
            body: JSON.stringify({
              username: username,
              blocked_by: loggedUser,
              action: "remove"
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
    else if(action==='following'){
      try{
        
        const response=await fetch(`http://localhost/ProjectMatchUp/API/handleFollow.php`,{
          method: "POST",
              headers: {
                  "Content-Type": "application/json",
                },
              credentials: "include",
              body: JSON.stringify({
                  profile: username,
                  action: "unfollow",
                  follower: loggedUser 
        })});
        const result=await response.json();
        if(result.success){
          console.log("Removed from followers");
        }
    
   }catch(error){
    console.error("Could not request remove follower",error);
   }
    }
    
    
  }
  useEffect(()=>{
    setIsFollow(type==='follow');
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
          } else {
            navigate("/settings");
          }
        } catch (error) {
          console.error("Error checking session:", error);
        }
      };
      checkAuth();
  },[type]);
  useEffect(()=>{
    const fetchInfo=async ()=>{
        if(type==='follow'){
           try{
            const response=await fetch("http://localhost/ProjectMatchUp/API/getFollowBlock.php",{
                method: "POST",
                headers: {"content-type":"application/json"},
                credentials: "include",
                body: JSON.stringify({
                    username: loggedUser,
                    action: "follow",
                    sort: sorting
                })
            })
           const result=await response.json();
           if(result.success){
            setFollowers(result.followers);
            setFollowing(result.following);
            
           }
           }catch(error){
            console.error("Could not get follow info",error);
           }
        }
        else if(type==='block'){
            try{
             const response=await fetch("http://localhost/ProjectMatchUp/API/getFollowBlock.php",{
                 method: "POST",
                 headers: {"content-type":"application/json"},
                 credentials: "include",
                 body: JSON.stringify({
                     username: loggedUser,
                     action: "block",
                     sort: sorting
                 })
             })
            const result=await response.json();
            if(result.success){
             setFollowers(result.blocked);
             
             
            }
            }catch(error){
             console.error("Could not get blocked info",error);
            }
         }
      }
      fetchInfo();
  })
  if(loggedUser===""){
    return (
        <div className="flex flex-col justify-center w-screen h-screen items-center bg-pink-300 text-white">
          <h1>LOADING....</h1>
        </div>
      );
  }
  return (
    <div className='flex flex-col w-screen h-screen bg-pink-200 gap-5'>
        <NavProfile username={loggedUser}/>
        <div className='flex'>
        <select
               value={sorting}
               onChange={(e) => setSorting(e.target.value)}
               className="bg-[#c8ecea] rounded-2xl border-1 border-solid border-black p-3 mr-2 mt-4 ml-2"
            >
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
        </select>
        
        </div>
        {isFollow?(<h3 className='m-2 ml-5'>Followers List</h3>):(<h3>Blocked</h3>)}
        <div className='flex flex-col'>
         {followers.length>0 &&
            (<ul>
                {followers.map((follower)=>(
                <li key={follower.username} className='flex flex-col mb-1 ml-5'>
                    <div className='flex gap-2 items-center border-2 border-black w-1/6 h-auto'>
                        <img src={follower.pfp_url?`${follower.pfp_url}`:"/user.png"} className='w-10 h-10 object-contain border-r-2 border-r-black'></img>
                        <Link to={`/profile/${follower.username}`}><h2 className='font-bold'>{follower.username}</h2></Link>
                        <button onClick={()=>handleRemove(follower.username,'follower')}className='border-2 p-1 ml-5 border-black bg-red-300 w-auto h-auto justify-self-end'>{isFollow?"Remove":"Unblock"}</button>
                    </div>
                </li>))}
            </ul>
        )}
        </div>
        {isFollow && following.length>0 && (<div>
        <h3 className='m-2 ml-5'>Following</h3>
        <ul>
        {following.map((follower)=>(
                <li key={follower.username} className='flex flex-col mb-1 ml-5'>
                    <div className='flex gap-2 items-center border-2 border-black w-1/6 h-auto'>
                        <img src={follower.pfp_url?`${follower.pfp_url}`:"/user.png"} className='w-10 h-10 object-contain border-r-2 border-r-black'></img>
                        <h2 className='font-bold'>{follower.username}</h2>
                        <button onClick={()=>handleRemove(follower.username,'following')} className='border-2 p-1 ml-5 border-black bg-red-300 w-auto h-auto justify-self-end'>{isFollow?"Remove":"Unblock"}</button>
                    </div>
                </li>))}
            </ul>
        </div>)}
    </div>
  )
}

export default ShowFollowBlocked