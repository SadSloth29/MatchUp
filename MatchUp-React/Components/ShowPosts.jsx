import React from 'react'
import { useState,useEffect } from 'react';
import EditModal from './EditModal';
const ShowPosts = ({username,location}) => {

  const [posts,setPosts]=useState([]);
  const [liked,setLiked]=useState(false);
  const [Src,setSrc]=useState("/Like.png");
  const [loggedUser,setLoggedUser]=useState("");
  const [isOwner,setIsOwner]=useState(false);

  const [openPostId, setOpenPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalAction, setModalAction] = useState('');

  const toggleDropDown=(postId)=>{
      setOpenPostId((prev)=>(prev===postId?null:postId));
  }

  const handleLike= async (postId,liked)=>{

        if(liked==0){
          setLiked(true);
          
        }
        else{
          setLiked(false);
        }
        
        setPosts((prevPosts)=>
        prevPosts.map((post)=>
        post.post_id===postId? {...post,liked: !liked } : post))
    
       try{
        const response=await fetch("http://localhost/ProjectMatchUp/API/toggleLike.php",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            credentials: "include",
            body: JSON.stringify({
                post_id: postId,
                action: liked ? "unlike" : "like", 
            })
        })

        const result=await response.json();
        if (!result.success) {
            console.error("Failed to update like status:", result.error);
            
            setPosts((prevPosts) =>
              prevPosts.map((post) =>
                post.post_id === postId ? { ...post, liked: liked } : post
              )
            );
        }
        

        
       }catch(error){
           console.error("Error updating like status:", error);
       }
          
  }
  useEffect(()=>{
    const checksession=async ()=>{
        try{
        const response=await fetch("http://localhost/ProjectMatchUp/Core/checksession.php",{
            method: "GET",
            credentials: "include"
        });
        const result=await response.json();

        if(result.success){
            setLoggedUser(result.username);
            setIsOwner(result.username===username);
        }
        }catch(error)
        {
            console.error('Error Checking Session',error);
        }
    };
    
  checksession();
  
  },[username]);

  useEffect(()=>{
    

    const fetchPosts=async ()=>{
        try{
          const response=await fetch(`http://localhost/ProjectMatchUp/API/getUserPosts.php?username=${username}&location=${location}&loggedUser=${loggedUser}`);
          const result=await response.json();

          if(result.success){
              setPosts(result.posts);
              
              
          }
        }catch(error){
          console.error('Error getting Posts',error);
        }
  };
  if (username && location) {
    fetchPosts();
} else {
    console.error("Missing username or location in request");
}
  });

  const openModal = (post, action) => {
    setSelectedPost(post);
    setModalAction(action);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setModalAction('');
  };
 
  
  return (
    
    <div className='m-5 border-2 p-5 border-black h-auto w-1/2 overflow-y-auto rounded-2xl bg-gray-50'>
    {(posts.length>0 && posts[0].post_id)? (
       <ul>
        {posts.map((post)=>(
       <li key={post.post_id} className='flex flex-col mb-2'>
             <div className='flex items-center border-2 border-black'>
                 <img src={post.profile_pic} className='object-fill h-10 w-10 rounded-full border-1 border-black m-2'  alt='profilepic'></img>
                 <h3>{post.posted_by}</h3>
                 {isOwner && (<button className='justify-self-end ml-5' onClick={()=>toggleDropDown(post.post_id)}><img src='/edit&.png' className='w-10 h-10 object-cover'></img></button>)}
                 {isOwner && openPostId===post.post_id && location!=="feed" && (
        <div className="mt-1 w-20 bg-white border border-gray-300 shadow-lg rounded-lg">
          <ul className="py-2 border-1 border-black rounded-2xl" id='ddm'>
            <li>
              <button onClick={() => openModal(post, 'edit')}>Edit</button>
            </li>
            <li>
              <button onClick={() => openModal(post, 'delete')}>Delete</button>
            </li>
            </ul>
            </div>
                 )}
             </div>
             {post.post_type !== "text" && (
  <div className="border-2 border-black">
    {post.post_type === "image" ? (
      <img src={post.img} className="object-contain h-60 w-full" alt="post image" />
    ) : post.post_type === "video" ? (
      <video src={post.vid} controls className="object-contain h-60 w-full" />
    ) : null}

    <button onClick={() => handleLike(post.post_id, post.liked)}>
      <img
        className="h-4 w-4 object-contain m-1"
        src={post.liked === 0 ? "/Like.png" : "/hearted.png"}
        alt="likeReact"
      />
    </button>
  </div>
)}
             <div className='border-2 border-black'>
                 <h3 className='underline'>{post.posted_by}</h3>
                 <h3>{post.content}</h3>
             </div>
         </li>))}
         
         
         
       </ul>):(<h4 className='text-2xl font-bold'>There are no posts.</h4>)}
       {selectedPost && <EditModal post={selectedPost} action={modalAction} onClose={closeModal} />}
    </div>
    
  )
}

export default ShowPosts