import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

const NavProfile = ({ username }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const handleLogOut = async () => {
    await fetch("http://localhost/ProjectMatchUp/API/logout.php", {
      credentials: "include",
    });
    alert("Logged Out Successfully");
    navigate("/");
  };

  const searchUser = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const response = await fetch(`http://localhost/ProjectMatchUp/API/searchUsers.php?query=${query}`);
        const data = await response.json();
        if (data.success) setSearchResults(data.users);
        else setSearchResults([]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target)
      ) {
        setSearchResults([]);
      }
      if (
        notifRef.current && !notifRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    const fetchNotifications = async () => {
      const res = await fetch(`http://localhost/ProjectMatchUp/API/get_notifications.php?user_id=${username}`);
      const data = await res.json();
      if (data.success) setNotifications(data.notifications);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [username]);

  const renderMessage = (type) => {
    switch (type) {
      case 'follow': return 'You got a new follow';
      case 'like': return 'You got a new like';
      case 'message': return 'You got a new message';
      case 'swipe': return 'You were swiped!';
      default: return 'New notification';
    }
  };

  return (
    <nav className='flex justify-between items-center bg-gray-800 text-white h-14 px-4 sm:px-6 md:px-10'>
      {/* Logo */}
      <div className='flex items-center'>
        <h1 className='text-2xl font-bold hidden sm:block'>
          <Link to={`/users/${username}`}>
            <span className='text-white'>Match</span>
            <span className='text-white'>Up</span>
          </Link>
        </h1>
      </div>

      {/* Search */}
      <div ref={searchRef} className='relative w-full max-w-xs'>
        <form method='get' name='search' className='flex items-center'>
          <input
            value={searchQuery}
            onChange={searchUser}
            className="p-2 bg-white border-2 border-gray-300 rounded-2xl w-full"
            type='text'
            placeholder="Search..."
          />
          <img src='/search.png' alt='search' className='p-2 w-8 h-8 ml-2 cursor-pointer' />
        </form>

        {searchResults.length > 0 && (
          <div className='absolute left-0 top-full mt-1 w-full max-h-60 overflow-y-auto bg-white border-2 border-gray-300 shadow-lg rounded-lg z-10'>
            <ul>
              {searchResults.map((user) => (
                <li key={user.username} className='border-b border-gray-200'>
                  <Link
                    to={`/profile/${user.username}`}
                    className='flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100'
                  >
                    <img
                      src={user.profile_image || 'user.png'}
                      alt='userpic'
                      className='w-8 h-8 rounded-full mr-4'
                    />
                    <p className='text-lg font-semibold'>{user.username}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Notification + Profile */}
      <div className='flex items-center gap-4'>
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <Bell className="w-6 h-6 text-white" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 max-h-60 overflow-y-auto bg-white text-black border border-gray-200 rounded-lg shadow-lg z-20">
              <div className="p-3 text-sm font-semibold text-gray-700 border-b">
                Recent Notifications
              </div>
              {notifications.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">No new notifications</div>
              ) : (
                <ul>
                  {notifications.map((n) => (
                    <li key={n.id} className="px-4 py-2 text-sm hover:bg-gray-100">
                      {renderMessage(n.type)}
                      <div className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className='relative'>
          <button onClick={() => setIsOpen(!isOpen)} className='border-2 border-white rounded-full p-1'>
            <img src='../public/user.png' alt='userlogo' className='object-fill w-12 h-8' />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-300 shadow-lg rounded-lg z-10">
              <ul className="py-2">
                <li>
                  <Link
                    to={`/profile/${username}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/settings/${username}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogOut}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavProfile;
