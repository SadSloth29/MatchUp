import React, { useEffect, useState } from 'react'
import NavProfile from "../Components/NavProfile"
import { useNavigate, useParams, Link } from 'react-router-dom'
import ShowPosts from '../Components/ShowPosts'
import PfpUploadPop from '../Components/PfpUploadPop'

const UserProfile = () => {
  const { username } = useParams();
  const [loggedUser, setLoggedUser] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [info, setInfo] = useState([]);
  const [user, setUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(null);

  const navigate = useNavigate();

  const handleBlock = async () => {
    try {
      const response = await fetch(`http://localhost/ProjectMatchUp/API/block.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          blocked_by: loggedUser,
          action: "insert"
        })
      });
      const result = await response.json();
      if (!result.success) {
        console.error("Could not finish block request", result.error);
      }
    } catch (error) {
      console.error("Could not connect to server", error);
    }
  }

  const handleUpload = async (newImageURL) => {
    if (!newImageURL) return;
    try {
      const response = await fetch(`http://localhost/ProjectMatchUp/API/UpdatePfp.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          profile_pic: newImageURL
        })
      });
      const result = await response.json();
      if (!result.success) {
        console.error("Failed to update profile picture:", result.error);
      }
    } catch (error) {
      console.error("Error updating profile pic", error);
    }
  }

  const handleFollow = async () => {
    setFollowed(!followed);
    try {
      const response = await fetch(`http://localhost/ProjectMatchUp/API/handleFollow.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          profile: username,
          action: followed ? "unfollow" : "follow",
          follower: loggedUser
        })
      });
      const result = await response.json();
      if (!result.success) {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error handling Follow", error)
    }
  }

  useEffect(() => {
    const checksession = async () => {
      try {
        const response = await fetch("http://localhost/ProjectMatchUp/Core/checksession.php", {
          method: "GET",
          credentials: "include"
        });
        const result = await response.json();

        if (result.success) {
          setLoggedUser(result.username);
          setIsOwner(result.username === username);
        }
      } catch (error) {
        console.error('Error Checking Session', error);
      }
    };

    checksession();
  }, [username]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch("http://localhost/ProjectMatchUp/API/getUserInfo.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: username,
            checking: loggedUser,
          }),
        });
        const result = await response.json();

        if (result.success) {
          setInfo(result.info);
          setUser(result.info.username);
          setFollowed(result.info[0].follow !== 0);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error fetching user info", error);
      }
    };

    const blocked = async () => {
      try {
        const response = await fetch(`http://localhost/ProjectMatchUp/API/block.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: username,
            blocked_by: loggedUser,
            action: "check"
          })
        });
        const result = await response.json();
        if (result.success) {
          setIsBlocked(result.info);
        }
      } catch (error) {
        console.error("Could not check blocked status", error);
      }
    }

    blocked();
    fetchInfo();
  }, [username, loggedUser]);

  if (isBlocked && (isBlocked.blocked1 === 1 || isBlocked.blocked2 === 1)) {
    return (
      <div className="w-screen h-screenbg-gradient-to-b from-blue-200 to-white flex flex-col justify-center items-center">
        <img src='/cat.png' className="object-contain w-1/4 h-1/4" alt="blocked" />
        <h2>Could not find this user. Press below to return to your feed</h2>
        <Link to={`/profile/${loggedUser}`} className="text-blue-600 underline">Back To Profile</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0 m-0">
      <NavProfile username={loggedUser} />
      <div className="bg-gradient-to-b from-blue-200 to-white p-5 sm:p-10">
        {info[0] ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <img src={info[0].img ? info[0].img : "/user.png"} className="object-cover w-32 h-32 rounded-full border-2 border-black shadow-lg" alt="profile-pic" />
              {isOwner && (
                <button onClick={() => setShowModal(true)} className="absolute bottom-0 right-0 p-2 bg-white border-2 rounded-full text-sm shadow-md">Update Image</button>
              )}
              {showModal && isOwner && <PfpUploadPop onclose={() => setShowModal(false)} onUpload={handleUpload} />}
            </div>
            <h1 className="text-2xl font-light text-black">{info[0].username}</h1>
            {!isOwner && (
              <div className="flex gap-3">
                <button onClick={handleFollow} className="py-1 px-3 border-2 rounded-xl bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white">{followed ? "Unfollow" : "Follow"}</button>
                <button onClick={handleBlock} className="py-1 px-3 border-2 rounded-xl text-red-600 border-red-600 hover:bg-red-600 hover:text-white">Block</button>
              </div>
            )}
            <div className="bg-white p-4 mt-5 rounded-xl border-2 border-gray-300 shadow-md w-full sm:w-2/3">
              <h3 className="text-lg font-semibold text-center text-indigo-600">Profile Details</h3>
              <div className="flex flex-col sm:flex-row justify-between mt-4 text-gray-700">
                <p>Age: {info[0].age}</p>
                <p>Gender: {info[0].gender}</p>
                <p>City: {info[0].city}</p>
                <p>Country: {info[0].country}</p>
                <p className="w-full text-center">Bio: {info[0].bio}</p>
              </div>
            </div>
            <div className="bg-white p-4 mt-5 rounded-xl border-2 border-gray-300 shadow-md w-full sm:w-2/3">
              <h3 className="text-lg font-semibold text-center text-indigo-600">Preferences</h3>
              <div className="flex justify-between mt-4 text-gray-700">
                <p>Personality: {info[0].pers}</p>
                <p>Distance: {info[0].md}KM</p>
              </div>
            </div>
            <ShowPosts username={username} location={"profile"} />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}

export default UserProfile
