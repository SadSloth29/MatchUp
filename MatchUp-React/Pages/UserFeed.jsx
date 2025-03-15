import React from "react";
import { useParams, useNavigate } from "react-router-dom";

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
      <h1>Welcome, {username}!</h1>
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default UserFeed;
