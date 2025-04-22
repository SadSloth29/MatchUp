import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavProfile from "../Components/NavProfile";
import ShowPosts from "../Components/ShowPosts";
import PostWindow from "../Components/PostWindow";
import { FaUserFriends, FaUserLock, FaHeartbeat, FaEnvelope } from "react-icons/fa";
import { useEffect } from "react";

const UserFeed = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checksession = async () => {
      try {
        const response = await fetch("http://localhost/ProjectMatchUp/Core/checksession.php", {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();

        if (result.success) {
          if (result.username !== username) {
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error Checking Session", error);
      }
    };

    checksession();
  }, [username]);

  return (
    <div>
      <NavProfile username={username} />
      <div className="flex flex-col gap-5 justify-between items-center w-auto">
        <div className="flex w-full h-auto items-center gap-2 justify-center rounded-4xl border-2 border-black p-4 mt-2 bg-white">
          <Link to={"/list/follow"} className="flex items-center gap-1 text-sm">
            <FaUserFriends className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10" />
            Followers
          </Link>
          <Link to={"/list/block"} className="flex items-center gap-1 text-sm">
            <FaUserLock className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10" />
            Blocked
          </Link>
          <Link to={`/matches/${username}`} className="flex items-center gap-1 text-sm">
            <FaHeartbeat className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10" />
            Matches
          </Link>
          <Link to={`/texts/${username}`} className="flex items-center gap-1 text-sm">
            <FaEnvelope className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10" />
            Inbox
          </Link>
        </div>
        <PostWindow username={username} />
        <ShowPosts username={username} location={"feed"} />
      </div>
    </div>
  );
};

export default UserFeed;
