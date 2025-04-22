import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavProfile from './NavProfile';

const ShowFollowBlocked = () => {
  const [sorting, setSorting] = useState('ASC');
  const [isFollow, setIsFollow] = useState(false);
  const [loggedUser, setLoggedUser] = useState('');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const { type } = useParams();
  const navigate = useNavigate();

  const handleRemove = async (username, action) => {
    if (action === 'follower' && isFollow) {
      try {
        const response = await fetch('http://localhost/ProjectMatchUp/API/handleFollow.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            profile: loggedUser,
            action: 'unfollow',
            follower: username,
          }),
        });
        const result = await response.json();
        if (result.success) {
          console.log('Removed from followers');
        }
      } catch (error) {
        console.error('Could not request remove follower', error);
      }
    } else if (action === 'follower' && !isFollow) {
      try {
        const response = await fetch('http://localhost/ProjectMatchUp/API/block.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            username: username,
            blocked_by: loggedUser,
            action: 'remove',
          }),
        });
        const result = await response.json();
        if (!result.success) {
          console.error('Could not finish block request', result.error);
        }
      } catch (error) {
        console.error('Could not connect to server', error);
      }
    } else if (action === 'following') {
      try {
        const response = await fetch('http://localhost/ProjectMatchUp/API/handleFollow.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            profile: username,
            action: 'unfollow',
            follower: loggedUser,
          }),
        });
        const result = await response.json();
        if (result.success) {
          console.log('Removed from followers');
        }
      } catch (error) {
        console.error('Could not request remove follower', error);
      }
    }
  };

  useEffect(() => {
    setIsFollow(type === 'follow');
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost/ProjectMatchUp/Core/checksession.php', {
          method: 'GET',
          credentials: 'include',
        });
        const result = await response.json();
        if (result.success) {
          setLoggedUser(result.username);
        } else {
          navigate('/settings');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    checkAuth();
  }, [type, navigate]);

  useEffect(() => {
    const fetchInfo = async () => {
      if (type === 'follow') {
        try {
          const response = await fetch('http://localhost/ProjectMatchUp/API/getFollowBlock.php', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              username: loggedUser,
              action: 'follow',
              sort: sorting,
            }),
          });
          const result = await response.json();
          if (result.success) {
            setFollowers(result.followers);
            setFollowing(result.following);
          }
        } catch (error) {
          console.error('Could not get follow info', error);
        }
      } else if (type === 'block') {
        try {
          const response = await fetch('http://localhost/ProjectMatchUp/API/getFollowBlock.php', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              username: loggedUser,
              action: 'block',
              sort: sorting,
            }),
          });
          const result = await response.json();
          if (result.success) {
            setFollowers(result.blocked);
          }
        } catch (error) {
          console.error('Could not get blocked info', error);
        }
      }
    };
    fetchInfo();
  }, [sorting, type, loggedUser]);

  if (loggedUser === '') {
    return (
      <div className="flex flex-col justify-center w-screen h-screen items-center bg-gradient-to-b from-blue-200 to-white text-white">
        <h1>LOADING....</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen h-screen max-h-auto bg-gradient-to-b from-blue-200 to-white gap-5">
      <NavProfile username={loggedUser} />
      <div className="flex justify-center items-center gap-2">
        <select
          value={sorting}
          onChange={(e) => setSorting(e.target.value)}
          className="bg-[#c8ecea] rounded-2xl border-1 border-solid border-black p-3 mt-4"
        >
          <option value="ASC">ASC</option>
          <option value="DESC">DESC</option>
        </select>
      </div>

      {isFollow ? (
        <h3 className="m-2 ml-5">Followers List</h3>
      ) : (
        <h3 className="m-2 ml-5">Blocked</h3>
      )}

      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {followers.length > 0 &&
          followers.map((follower) => (
            <div
              key={follower.username}
              className="flex flex-col items-center bg-white p-2 rounded-lg shadow-md max-w-[300px] w-full"
            >
              <img
                src={follower.pfp_url ? `${follower.pfp_url}` : '/user.png'}
                className="w-15 h-15 object-cover rounded-full mb-4"
                alt={follower.username}
              />
              <Link to={`/profile/${follower.username}`} className="font-medium text-black">
                {follower.username}
              </Link>
              <button
                onClick={() => handleRemove(follower.username, 'follower')}
                className="mt-2 px-2 py-2 bg-red-500 text-white rounded-lg"
              >
                {isFollow ? 'Remove' : 'Unblock'}
              </button>
            </div>
          ))}
      </div>

      {isFollow && following.length > 0 && (
        <div className="mt-5">
          <h3 className="m-2 ml-5">Following</h3>
          <div className="flex overflow-y-scroll flex-wrap justify-center gap-6">
            {following.map((follower) => (
              <div
                key={follower.username}
                className="flex flex-col items-center bg-white p-5 rounded-lg shadow-md max-w-[300px] w-full"
              >
                <img
                  src={follower.pfp_url ? `${follower.pfp_url}` : '/user.png'}
                  className="w-15 h-15 object-cover rounded-full mb-4"
                  alt={follower.username}
                />
                <h2 className="font-medium text-black">{follower.username}</h2>
                <button
                  onClick={() => handleRemove(follower.username, 'following')}
                  className="mt-2 px-2 py-2 bg-red-500 text-white rounded-lg"
                >
                  {isFollow ? 'Remove' : 'Unblock'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowFollowBlocked;
