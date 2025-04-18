import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
const MatchRec = ({closeModal,setCloseModal}) => {
  const [users,setUsers]=useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const {username}=useParams();
  const navigate=useNavigate();
  
  useEffect(()=>{
    const getMatches= async ()=>{
        const response=await fetch("http://localhost/ProjectMatchUp/API/getMatches.php",{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
        username:username,
       })
       })
       const result=await response.json();
       if(result.success){
        setUsers(result.matches);
        console.log(result.matches);
       }
       else{
        console.error(result.error);
       }
    }
    getMatches();
  }, []);
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
  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, users.length - 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleSwipeLeft = async () => {
    console.log(`Swiped left on ${users[currentIndex].username}`);
    try{
      const response=await fetch("http://localhost/ProjectMatchUp/API/swipe.php",{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
        username:users[currentIndex].username,
        user: username,
        type: "left"
       })})
      const result=await response.json();
      if(result.success){
        setUsers((prevUsers) => {
          const updated = [...prevUsers];
          updated.splice(currentIndex, 1);
          return updated;
        });
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }
    }catch(error){
        
    }
    
  };

  const handleSwipeRight = async () => {
    console.log(`Swiped right on ${users[currentIndex].username}`);
    try{
      const response=await fetch("http://localhost/ProjectMatchUp/API/swipe.php",{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
        username:users[currentIndex].username,
        user: username,
        type: "right"
       })})
       const result=await response.json();
       if(result.success){
        setUsers((prevUsers) => {
          const updated = [...prevUsers];
          updated.splice(currentIndex, 1);
          return updated;
        });
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }
    }catch(error){
        
    }
   
  };

  const handleExit = () => {
    setCloseModal(false);
    navigate(`/matches/${username}`);
    
  };
  if (users.length === 0 && closeModal) {
    return (
      <div className="h-1/2 bg-gray-100 flex justify-center items-center py-6 mt-4 rounded-2xl">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 relative">
          <button
            onClick={handleExit}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
          <div className="text-center p-6 text-gray-600">
            <h2 className="text-xl font-semibold mb-2">No more matches to show.</h2>
            <p>Come back later to see new recommendations.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
    {closeModal && (
    <div className="h-1/2 bg-gray-100 flex justify-center items-center py-6 mt-4 rounded-2xl">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 relative">
        {/* Exit Button */}
        <button
          onClick={handleExit}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        {/* User Card */}
        <div className="text-center">
          <img
            src={users[currentIndex].url}
            alt={users[currentIndex].username}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold">{users[currentIndex].username}</h3>
          <h3 className="text-gray-500">Match: {users[currentIndex].percentage}%</h3>
          <h3 className="text-gray-500">{users[currentIndex].distance}KM</h3>
        </div>

        {/* Swipe Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handleSwipeLeft}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            Swipe Left
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            Next
          </button>
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
          >
            Previous
          </button>
          <button
            onClick={handleSwipeRight}
            className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
          >
            Swipe Right
          </button>
        </div>
      </div>
    </div>
)}
</>);
};

export default MatchRec;