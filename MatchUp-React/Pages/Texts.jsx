import React, { useState, useEffect } from 'react';
import MessageWindow from '../Components/messageWindow';
import NavProfile from '../Components/NavProfile';
import { useParams, useNavigate } from 'react-router-dom';

const Texts = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onShow, setOnShow] = useState(false);

  useEffect(() => {
    const checksession = async () => {
      try {
        const response = await fetch("http://localhost/ProjectMatchUp/Core/checksession.php", {
          method: "GET",
          credentials: "include"
        });
        const result = await response.json();

        if (!result.success || result.username !== username) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error Checking Session', error);
        navigate('/login');
      }
    };

    const getUsers = async () => {
      try {
        const response = await fetch("http://localhost/ProjectMatchUp/API/getSwipes.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username })
        });
        const result = await response.json();
        if (result.success) {
          setUsers(result.users);
        }
      } catch (error) {
        console.log("Error getting users", error);
      }
    };

    checksession();
    getUsers();
  }, [username, navigate]);
  console.log(users);
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <NavProfile username={username} />

      <div className="flex flex-1 overflow-hidden">
        
        <div className="w-1/3 border-r p-4 bg-white overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Your Matches</h2>
          <ul className="space-y-3">
            {users.map((user) => (
              <li key={user.username} className="flex items-center gap-3">
                <img
                  src={user.profile_Pic}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setOnShow(true);
                  }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {user.username}
                </button>
              </li>
            ))}
          </ul>
        </div>

        
        <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
          {onShow && selectedUser && (
            <MessageWindow username={username} chatWith={selectedUser} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Texts;