import React from 'react'
import { useState } from 'react'
const PfpUploadPop = ({ onclose, onUpload }) => {

  const [selectedFile,setSelectedFile]=useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
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
        onUpload(result.fileUrl); 
        onclose();
      } else {
        console.error("Upload failed:", result.error);
      }
    } 
    catch(error) {
        console.error("Error uploading image", error);
      }
  }
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded-lg flex flex-col gap-5">
        <div className='flex justify-between items-center'>
        <h4>Update Profile Picture</h4>
        <button className="self-end" onClick={onclose}><img className='w-10 h-10'src='/cancel.png'></img></button>
        </div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload} className="bg-pink-200 text-white p-2 rounded">
          Upload
        </button>
       </div>

    </div>
  )
}

export default PfpUploadPop