import React from 'react'
import { useState } from 'react';
const PostWindow = ({username}) => {
  
  const [showModal, setShowModal] = useState(false);
  const [selectedFile,setSelectedFile]=useState(null);
  const [type,setType]=useState("text");
  const [content,setContent]=useState("");
  const [postId,setPostId]=useState(null);
  const [fileUrl,setFileUrl]=useState("");
  const handleFileChange=(event)=>{
    setSelectedFile(event.target.files[0]);
  }
  const handleUpload= async ()=>{
    if(!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try{
        const response=await fetch("http://localhost/ProjectMatchUp/Core/upload.php",{
            method: "POST",
            body: formData
        })
        const result=await response.json();
        
      if (result.fileUrl) {
        setFileUrl(result.fileUrl);
        setShowModal(false);
      } else {
        console.error("Upload failed:", result.error);
      }
    } 
    catch(error) {
        console.error("Error uploading image", error);
      }
}
 const handleSubmit=async ()=>{
    

    try{
        const response=await fetch('http://localhost/ProjectMatchUp/API/InsertPost.php',{
                method: "POST",
                headers: {"content-type":"application/json"},
                credentials: "include",
                body: JSON.stringify({
                    content:content,
                    type:type,
                    username:username
                })});
        const result=await response.json();

        if(result.success){
            const newPostId = result.postId[0].post_id; 
            setPostId(newPostId);
            setContent("");
            if(type==="image" || type==="video"){
                try{
                    const imgRes=await fetch('http://localhost/ProjectMatchUp/API/uploadMedia.php',{
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        credentials: "include",
                        body: JSON.stringify({
                            post_id: newPostId,
                            type: type,
                            url: fileUrl,
                            action: "insert"
                        })});
        
                    const imgresult=await imgRes.json();
                    if(!imgresult.success){
                        console.error("failed to upload media",result.error);
                    }
                }catch(error){
                    console.error("Error with request",error);
                }
            }
        }
    }catch(error){
        console.error("Could not upload post",error);
    }

    
 }
  return (
    <div className='flex flex-col w-1/4 h-32 border-2 border-black p-2 m-5 mb-2 rounded-2xl'>
        <div className='flex bg-gray-300 w-full h-full overflow-y-auto align-text-top border-2 border-black'>
            <input id='ddm' type='text' value={content} onChange={(e)=>setContent(e.target.value)}placeholder="Enter What's on your mind" className='h-full w-full'></input>
        </div>
        <div className='flex justify-start items-center'>
            <button className='w-5 h-5 mr-4 mt-1' onClick={()=>{setShowModal(true); setType("image") }}><img className='object-contain w-full h-full'src='/gallery.png'></img></button>
            <button className='w-5 h-5 mt-1' onClick={()=>{setShowModal(true); setType("video") }}><img className='object-contain w-full h-full'src='/multimedia.png'></img></button>
            <button onClick={handleSubmit} className='w-auto h-5 border-2 border-black px-2 ml-10 mt-1 bg-blue-500 text-sm rounded-2xl'>Submit</button>
        </div>
        {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded-lg flex flex-col gap-5">
        <div className='flex justify-between items-center'>
        <h4>{type==="image"?"Upload image":"Upload video"}</h4>
        <button className="self-end" onClick={()=>{setShowModal(false); setType("text")}}><img className='w-10 h-10'src='/cancel.png'></img></button>
        </div>
        <input type="file" accept={type==="image"?"image/*":"video/*"} onChange={handleFileChange} />
        <button onClick={handleUpload} className="bg-red-400 text-white p-2 rounded">
          Upload
        </button>
       </div>
       </div>
    )}
    
    </div>
  )
}

export default PostWindow