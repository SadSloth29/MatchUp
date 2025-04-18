import React, { useState } from 'react'
import { useParams, useNavigate} from "react-router-dom";
const InterestsModal = () => {
  const [pq1,setPq1]=useState(0);
  const [pq2,setPq2]=useState(0);
  const [pq3,setPq3]=useState(0);
  const [pq4,setPq4]=useState(0);
  const [pq5,setPq5]=useState(0);
  const [oq1,setOq1]=useState(0);
  const [oq2,setOq2]=useState(0);
  const [oq3,setOq3]=useState(0);
  const [oq4,setOq4]=useState(0);
  const [oq5,setOq5]=useState(0);
  const {username}=useParams();
  const navigate=useNavigate();
  const handleAnswers=async ()=>{
    try{
        const response=await fetch("http://localhost/ProjectMatchUp/API/interests.php",{
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({
                pq1:pq1,
                pq2:pq2,
                pq3:pq3,
                pq4:pq4,
                pq5:pq5,
                oq1:oq1,
                oq2:oq2,
                oq3:oq3,
                oq4:oq4,
                oq5:oq5,
                username:username,
                action: "none"

            })})
            const result=response.json();
            if(result.success){
                 navigate(`/matches/${username}`);
            }

    }catch(error){

    }
  }
  return (
    <div className='w-1/2 h-auto bg-pink-200 rounded-2xl flex flex-col items-center justify-center justify-self-center mt-1 border-2 border-black'>
        <h2 className='font-bold underline'>Traits you want in your partner</h2>
        <div className='flex gap-1 m-2 border-2 border-black border-solid p-1'>
            <label>How intellectual should your ideal match be?
            (1 = casual thinker, 5 = deep/intense thinker)</label>
            <select value={pq1} onChange={(e)=>setPq1(e.target.value)}>
                <option>
                1
                </option>
                <option>
                2
                </option>
                <option>
                3
                </option>
                <option>
                4
                </option>
                <option>
                5
                </option>
            </select>
        </div>
        <div className='flex gap-1 m-2 border-2 border-black border-solid p-1'>
            <label>How important is a good sense of humor in a partner?
            (1 = not important, 5 = extremely important)</label>
            <select value={pq2} onChange={(e)=>setPq2(e.target.value)}>
                <option>
                1
                </option>
                <option>
                2
                </option>
                <option>
                3
                </option>
                <option>
                4
                </option>
                <option>
                5
                </option>
            </select>
        </div>
        <div className='flex gap-1 m-2 border-2 border-black border-solid p-1'>
            <label>What type of personality do u like (starting from introvert to extrovert)?</label>
            <select value={pq3} onChange={(e)=>setPq3(e.target.value)}>
                <option>
                1
                </option>
                <option>
                2
                </option>
                <option>
                3
                </option>
                <option>
                4
                </option>
                <option>
                5
                </option>
            </select>
        </div>
        <div className='flex gap-1 m-2 border-2 border-black border-solid p-1'>
            <label>How adventurous should your ideal match be?
            (1 = prefers routine, 5 = loves trying new things)</label>
            <select value={pq4} onChange={(e)=>setPq4(e.target.value)}>
                <option>
                1
                </option>
                <option>
                2
                </option>
                <option>
                3
                </option>
                <option>
                4
                </option>
                <option>
                5
                </option>
            </select>
        </div>
        <div className='flex gap-1 m-2  border-2 border-black border-solid p-1'>
            <label>How emotionally open should your ideal match be?
            (1 = reserved, 5 = very expressive)</label>
            <select value={pq5} onChange={(e)=>setPq5(e.target.value)}>
                <option>
                1
                </option>
                <option>
                2
                </option>
                <option>
                3
                </option>
                <option>
                4
                </option>
                <option>
                5
                </option>
            </select>
        </div>
        <h2 className='font-bold underline'>Rating your own traits</h2>
        <div className='flex gap-1 m-2  border-2 border-black border-solid p-1'>
            <label>How intellectual would you rate yourself?
            (1 = casual thinker, 5 = deep/intense thinker)</label>
            <select value={oq1} onChange={(e)=>setOq1(e.target.value)}>
                <option>
                1
                </option>
                <option>
                2
                </option>
                <option>
                3
                </option>
                <option>
                4
                </option>
                <option>
                5
                </option>
            </select>
        </div>
        <div className='flex gap-1 m-2 border-2 border-black border-solid p-1'>
            <label>Rate your sense of humour?</label>
            <select value={oq2} onChange={(e)=>setOq2(e.target.value)}>
                <option>
                1
                </option>
                <option>
                2
                </option>
                <option>
                3
                </option>
                <option>
                4
                </option>
                <option>
                5
                </option>
            </select>
        </div>
        <div className='flex gap-1 m-2  border-2 border-black border-solid p-1'>
            <label>Describe your personality (starting from introvert to extrovert)?</label>
            <select value={oq3} onChange={(e)=>setOq3(e.target.value)}>
                <option>
                1
                </option>
                <option>
                2
                </option>
                <option>
                3
                </option>
                <option>
                4
                </option>
                <option>
                5
                </option>
            </select>
        </div>
        <div className='flex gap-1 m-2 border-2 border-black border-solid p-1'>
            <label>How adventurous are you?
            (1 = prefers routine, 5 = loves trying new things)</label>
            <select value={oq4} onChange={(e)=>setOq4(e.target.value)}>
                <option>
                1
                </option>
                <option>
                2
                </option>
                <option>
                3
                </option>
                <option>
                4
                </option>
                <option>
                5
                </option>
            </select>
        </div>
        <div className='flex gap-1 m-2 border-2 border-black border-solid p-1'>
            <label>How emotionally open are you?
            (1 = reserved, 5 = very expressive)</label>
            <select value={oq5} onChange={(e)=>setOq5(e.target.value)}>
                <option>
                1
                </option>
                <option>
                2
                </option>
                <option>
                3
                </option>
                <option>
                4
                </option>
                <option>
                5
                </option>
            </select>
        </div>
        <button onClick={handleAnswers} className='w-auto h-auto border-2 border-black border-solid p-1 bg-blue-300 mb-0.5'><h2 className='font-semibold'>Submit</h2></button>
    </div>
  )
}

export default InterestsModal