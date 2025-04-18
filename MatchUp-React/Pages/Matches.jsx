import React, { useState } from 'react'
import InterestsModal from '../Components/InterestsModal'
import NavProfile from '../Components/NavProfile'
import { useEffect } from 'react'
import { Link, useNavigate,useParams } from 'react-router-dom'
import MatchRec from '../Components/MatchRec'
import { calculateDistance } from '../Algorithms/distance'
import { Similarity,similarityToPercentage } from '../Algorithms/recommendation'
const Matches = () => {
  const [showModal,setShowModal]=useState(false);
  const {username}=useParams();
  const [others,setOthers]=useState([]);
  const [own,setOwn]=useState({});
  const [recommendedMatches, setRecommendedMatches] = useState([]);
  const [showRecommendationsModal,setShowRecommendationsModal]=useState(false);
  const navigate=useNavigate();
  const [closeModal,setCloseModal]=useState(false);
  const handleSubmitMatches=async ()=>{
    calculateMatches(others,own);
    if(recommendedMatches.length>0){
    try {
      const response = await fetch("http://localhost/ProjectMatchUp/API/storeMatches.php", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          username1: username,
          matches: recommendedMatches,
        })
      });
      const result = await response.json();
      if (result.success) {
        console.log("Matches stored!");
        setCloseModal(false);
      } else {
        console.log("Some matches already existed or failed to store");
      }
    } catch (error) {
      console.error("Error sending matches to backend", error);
    }
  }
  }
  useEffect(()=>{
  const checkInterest= async ()=>{
     const response=await fetch("http://localhost/ProjectMatchUp/API/interests.php",{
       method: "POST",
       headers: { 'Content-Type': 'application/json' },
       credentials: "include",
       body: JSON.stringify({
        username:username,
        action: "check"
       })
     });
     const result=await response.json();
     if(result.success){
      if(result.count===1){
        setShowModal(false);
        try{
          const userResponse=await fetch("http://localhost/ProjectMatchUp/API/getAllInterests.php",{
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
          body: JSON.stringify({
            username:username,
          })
          })
          const interests=await userResponse.json();
          if(interests.success){
            setOthers(interests.others);
            setOwn(interests.own);
          }


        }catch(error){
          console.error("could not fetch user interests",error);
        }
      }
      else{
        setShowModal(true);
      }
     }
  }
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
  checkInterest();
  },[username]);
  const calculateMatches=(others,own)=>{
    let matches = [];
    
    others.forEach(user => {

     const distance=calculateDistance(own.latitude,own.longitute,user.latitude,user.longitute);
     console.log(distance,own.match_distance);
     if(distance>own.match_distance) return;

     const ownTraits = [
        own.q1,
        own.q2,
        own.q3,
        own.q4,
        own.q5
     ];
     console.log(ownTraits)
     const partnerPreferences = [
       user.q1,
       user.q2,
       user.q3,
       user.q4,
       user.q5
     ];
     console.log(partnerPreferences);
     const similarity = Similarity(ownTraits, partnerPreferences);
     console.log(similarity);
     const percentage = similarityToPercentage(similarity);
     console.log(percentage);

     if(percentage>=70){
       matches.push({
         username2:user.partner,
         matchPercentage: percentage,
         distance
       });
     }


     
    });
    setRecommendedMatches(matches);
    setCloseModal(true);

 }
 
  
  if(others.length===0 && !own){
    return (
      <div className="flex flex-col justify-center w-screen h-screen items-center bg-pink-300 text-white">
        <h1>LOADING....</h1>
      </div>
    );
  }
  return (
    <>
    <NavProfile username={username}></NavProfile>
    {showModal && (<InterestsModal></InterestsModal>)}
    <div className='flex flex-col gap-1 items-center'>
      <div className='flex gap-3 px-4 py-1 border-4 border-black border-solid bg-pink-200 rounded-2xl mt-4 mb-2 w-1/5 justify-center items-center justify-self-center'>
      <button onClick={handleSubmitMatches}>Recommendation</button>
      <button>Matches List</button>
      </div>
      <MatchRec closeModal={closeModal} setCloseModal={setCloseModal}/>
    </div>
    
    </>
  )
}

export default Matches