import React from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    <div className="flex flex-col gap-10 justify-between items-center">
      
      <PostWindow username={username}/>
      <ShowPosts username={username} location={"feed"}></ShowPosts>
    </div>
    </div>
  );
};

export default UserFeed;
