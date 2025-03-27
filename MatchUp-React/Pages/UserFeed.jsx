import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavProfile from "../Components/NavProfile";
import ShowPosts from "../Components/ShowPosts";
import PostWindow from "../Components/PostWindow";

const UserFeed = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    await fetch("http://localhost/ProjectMatchUp/API/logout.php", {
      credentials: "include",
    });
    alert("Logged Out Successfully");
    navigate("/");
  };
  

  return (
    <div>
    <NavProfile username={username}/>
    
    
    <div className="flex flex-col gap-5 justify-between items-center w-auto">
    <div className="flex w-full h-auto items-center gap-3 justify-center rounded-3xl border-2 border-black p-4 mt-2 bg-white">
      <Link to={"/list/follow"}>Followers</Link>
    </div>
      <PostWindow username={username}/>
      <ShowPosts username={username} location={"feed"}></ShowPosts>
    </div>
    
    </div>
  );
};

export default UserFeed;
