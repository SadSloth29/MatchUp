import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavProfile from "../Components/NavProfile";
import ShowPosts from "../Components/ShowPosts";
import PostWindow from "../Components/PostWindow";
import { useEffect } from "react";
const UserFeed = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  useEffect(()=>{
      const checksession=async ()=>{
          try{
          const response=await fetch("http://localhost/ProjectMatchUp/Core/checksession.php",{
              method: "GET",
              credentials: "include"
          });
          const result=await response.json();
  
          if(result.success){
              if(result.username!==username){
                navigate('/login');
              }
          }
          else{
            navigate('/login');
          }
          }catch(error)
          {
              console.error('Error Checking Session',error);
          }
      };
      
      
      checksession();
      
      
      
    },[username]);

  return (
    <div>
    <NavProfile username={username}/>
    
    
    <div className="flex flex-col gap-5 justify-between items-center w-auto">
    <div className="flex w-full h-auto items-center gap-3 justify-center rounded-4xl border-2 border-black p-4 mt-2 bg-white">
      <Link to={"/list/follow"}>Followers</Link>
      <Link to={"/list/block"}>Blocked</Link>
      <Link to={`/matches/${username}`}>Matches</Link>
      <Link to={`/texts/${username}`}>Inbox</Link>
      

    </div>
      <PostWindow username={username}/>
      <ShowPosts username={username} location={"feed"}></ShowPosts>
    </div>
    
    </div>
  );
};

export default UserFeed;
