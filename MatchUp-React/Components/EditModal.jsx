import React, { useState } from 'react'

const EditModal = ({post,action, onClose}) => {
    const [content,setContent]=useState(post.content || "");
    const [type,setType]=useState(post.post_type || "");
    const [selectedFile,setSelectedFile]=useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleFileChange = (event) => {
        if(type==='image'){
            setSelectedFile(event.target.files[0]);
        }
        else{
           setSelectedFile(event.target.files[0]);
        }
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
            return result.fileUrl;
          } else {
            console.error("Upload failed:", result.error);
          }
        } 
        catch(error) {
            console.error("Error uploading image", error);
          }
    }

    const handleSubmit=async ()=>{
        let fileUrl=await handleUpload();

        const updatePost={};
        if(content !== post.content) updatePost.content=content;
        else updatePost.content=post.content;
        if(type !== post.post_type) updatePost.post_type=type;
        else updatePost.post_type=post.post_type

        if (Object.keys(updatePost).length === 0) {
            console.log('No changes made.');
            setIsSubmitting(false);
            return;
        }

        updatePost.post_id = post.post_id;

        console.log(updatePost);

        if(updatePost.post_type==="image" || updatePost.post_type==="video"){
            try{
                const response=await fetch("http://localhost/ProjectMatchUp/API/uploadMedia.php",{
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                    body: JSON.stringify({
                        post_id: updatePost.post_id,
                        type: updatePost.post_type,
                        url: fileUrl,
                        action: post.post_type!="text"? "update":"insert"
                    })
                })
                const result=await response.json();
                if(!result.success){
                    console.error("Error Uploading Media",result.error);
                }
            }catch(error){
                console.error("Error fetching Uploads",error);
            }
        }

        try{
            const response=await fetch("http://localhost/ProjectMatchUp/API/updatePost.php",
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatePost),
                });
            const result=await response.json();
            if(result.success){
                onClose();
            }else {
                console.error('Failed to update post:', result.error);
            }

        }catch(error){
            console.error('Failed to Update post',error);
        }finally{
            setIsSubmitting(false);
        }
    }

    const handleDelete= async ()=>{
        

        setIsSubmitting(true);

        try{
            const response=await fetch("http://localhost/ProjectMatchUp/API/deletePost.php",{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ post_id: post.post_id
                     }),
                });
            const result=await response.json();
            if (result.success) {
                onClose();
            } else {
                console.error('Failed to delete post:', result.error);
            }

        }catch(error){
            console.error('Error deleting post:', error);
        }finally{
            setIsSubmitting(false);
        }
    }
    return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <h2>{action==="edit"?"Edit Post":"Delete Post"}</h2>
            {action==="edit"? (
            <div>
               <label htmlFor="content" className="block mb-2">Content:</label>
               <input name='content' type='text' value={content} onChange={(e)=>setContent(e.target.value)}></input>
               <label htmlFor="type" className="block mt-4 mb-2">Type:</label>
               <input required name='type' type='text' value={type} onChange={(e)=>setType(e.target.value)}></input>
               {type !== 'text' && <input type="file" accept={type === 'image' ? 'image/*' : 'video/*'} onChange={handleFileChange} />}
               <div className="mt-6 flex justify-end space-x-3">
                            <button 
                                onClick={onClose} 
                                className="px-4 py-2 bg-gray-400 text-white rounded"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit} 
                                disabled={isSubmitting}
                                className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                </div>
            </div>): (
                    <div className="text-center">
                        <p className="mb-4">Are you sure you want to delete this post?</p>
                        <div className="flex justify-center space-x-3">
                            <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
                                Cancel
                            </button>
                            <button 
                                onClick={handleDelete} 
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
        </div>
    </div>
    );
}

export default EditModal