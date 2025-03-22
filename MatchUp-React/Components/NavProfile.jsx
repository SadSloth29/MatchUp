import React from 'react'
import { useState,useEffect,useRef } from 'react'
import { useNavigate,Link } from 'react-router-dom'
const NavProfile = ({username}) => {
  const navigate=useNavigate();
  const [isOpen,setIsOpen]=useState(false);
  const [searchQuery,setSearchQuery]=useState("");
  const [searchResults,setSearchResults]=useState([]);
  const searchref=useRef(null);
  const handleLogOut = async () => {
    await fetch("http://localhost/ProjectMatchUp/API/logout.php", {
      credentials: "include",
    });
    alert("Logged Out Successfully");
    navigate("/");
  };
  const searchUser= async (e)=>{
    const query=e.target.value;
    setSearchQuery(query);

    if(query.length>0){
      try{
        const response=await fetch(`http://localhost/ProjectMatchUp/API/searchUsers.php?query=${query}`);

        const data=await response.json();

        if(data.success){
          setSearchResults(data.users);
        }
        else{
          setSearchResults([]);
        }
      }catch(error){
        console.error("Error fetching users:", error);
      }
    }
    else{
      setSearchResults([]);
    }

  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchref.current && !searchref.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <nav className='flex max-w-screen h-14 gap-5 justify-between items-center bg-pink-400 border-1 border-solid border-black'>
        <div className='p-5 mr-2'>
            <h1 className='text-2xl'>
              <Link to={`/users/${username}`}>
              <span className='text-[#fde7f0]'>Match</span>
              <span className='text-[#ff3888]'>Up</span>
              </Link>
            </h1>
        </div>
        <div ref={searchref} className='relative'>
          <form method='get' name='search' className='flex m-2'>
            <input value={searchQuery} onChange={searchUser} className="p-2 m-2 ml-1 bg-white border-1 border-black rounded-2xl" type='text'></input> 
            <img src='/search.png' alt='search' className='object-fill p-2 w-10 h-10 mt-2 ml-2 align-middle'></img>
          </form>
          {searchResults.length>0 && (
            <div className='absolute left-0 top-full mt-0 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 shadow-lg rounded-lg'>
              <ul>
                {searchResults.map((user)=>(
                  <li key={user.username} className='flex gap-5 justify-between items-center border-1 border-black h-auto'>
                    <Link to={`/profile/${user.username}`} className=' flex px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border-1 border-black w-full rounded-lg'>
                    <img src={user.profile_image|| 'user.png'} alt='userpic' className='w-8 h-8 rounded-full mr-5'></img>
                    <p className='text-2xl font-bold mt-1'>{user.username}</p>
                    </Link>
                  </li>
                ))}
                
              </ul>
            </div>
          )}
        </div>
        <div>
          <button onClick={()=> setIsOpen(!isOpen)} className='border-1 border-black rounded-sm mr-5 mt-1'>
            <img src='../public/user.png' alt='userlogo' className='object-fill p-0 w-12 h-12 m-0 align-middle'></img>
          </button>
          {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg">
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
    </nav>
  )
}

export default NavProfile