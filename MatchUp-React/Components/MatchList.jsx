import React from 'react'
import { useState,useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
const MatchList = ({showList,username}) => {
    const [sorting,setSorting]=useState("ASC");
    const [orderby,setOrder]=useState("");
    const [isRequest,setIsRequest]=useState("Matches");
    const [loggedUser, setLoggedUser] = useState('');
    const [followers, setFollowers] = useState([]);
    useEffect(() => {
        const checkAuth = async () => {
          try {
            const response = await fetch('http://localhost/ProjectMatchUp/Core/checksession.php', {
              method: 'GET',
              credentials: 'include',
            });
            const result = await response.json();
            if (result.success) {
              setLoggedUser(result.username);
              
            } else if(loggedUser!==username){
              navigate('/login');
            }
          } catch (error) {
            console.error('Error checking session:', error);
          }
        };
        checkAuth();
      }, [username]);
    useEffect(() => {
        const fetchInfo = async () => {
          
            try {
              const response = await fetch('http://localhost/ProjectMatchUp/API/getMatchList.php', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  username: loggedUser,
                  action: isRequest,
                  orderby: orderby,
                  sort: sorting,
                }),
              });
              const result = await response.json();
              if (result.success) {
                setFollowers(result.followers);
                
              }
            } catch (error) {
              console.error('Could not get follow info', error);
            }
        } 
        fetchInfo();
        }, [sorting,loggedUser,isRequest,orderby]);
    return (
        <>
        {showList && (
        <div className="flex flex-col w-screen h-screen max-h-auto bg-gradient-to-b from-blue-200 to-white gap-5">
          <div className="flex justify-center items-center gap-2">
          <select
              value={isRequest}
              onChange={(e) => setIsRequest(e.target.value)}
              className="bg-[#c8ecea] rounded-2xl border-1 border-solid border-black p-3 mt-4"
            >
              <option value="Matches">Matches</option>
              <option value="Requests">Requests</option>
            </select>
          <select
              value={orderby}
              onChange={(e) => setOrder(e.target.value)}
              className="bg-[#c8ecea] rounded-2xl border-1 border-solid border-black p-3 mt-4"
            >
              <option value="Percentage">Percentage</option>
              <option value="Distance">Distance</option>
            </select>
            <select
              value={sorting}
              onChange={(e) => setSorting(e.target.value)}
              className="bg-[#c8ecea] rounded-2xl border-1 border-solid border-black p-3 mt-4"
            >
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </div>
    
          {isRequest==="Matches" ? (
            <h3 className="m-2 ml-5">Matches</h3>
          ) : (
            <h3 className="m-2 ml-5">Request</h3>
          )}
    
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            {followers.length > 0 &&
              followers.map((follower) => (
                <div
                  key={follower.username}
                  className="flex flex-col items-center bg-white p-2 rounded-lg shadow-md max-w-[300px] w-full"
                >
                  <img
                    src={follower.profile_pic ? `${follower.profile_pic}` : '/user.png'}
                    className="w-15 h-15 object-cover rounded-full mb-4"
                    alt={follower.username}
                  />
                  <h3 className="text-gray-500">Match: {follower.Percentage}%</h3>
                  <h3 className="text-gray-500">{follower.Distance}KM</h3>
                  <Link to={`/profile/${follower.username}`} className="font-medium text-black">
                    {follower.username}
                  </Link>
                 
                  <button
                    onClick={() => handleRemove(follower.username, 'follower')}
                    className="mt-2 px-2 py-2 bg-red-500 text-white rounded-lg"
                  >
                    {isRequest==="Matches" ? 'Remove' : 'Accept'}
                  </button>
                </div>
              ))}
          </div>
    
         
        </div>)}
        </>
      );
}

export default MatchList