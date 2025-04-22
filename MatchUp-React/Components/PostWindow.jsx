import React, { useState } from 'react';

const PostWindow = ({ username }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [type, setType] = useState("text");
  const [content, setContent] = useState("");
  const [postId, setPostId] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost/ProjectMatchUp/Core/upload.php", {
        method: "POST",
        body: formData
      });
      const result = await response.json();

      if (result.fileUrl) {
        setFileUrl(result.fileUrl);
        setShowModal(false);
      } else {
        console.error("Upload failed:", result.error);
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost/ProjectMatchUp/API/InsertPost.php', {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: content,
          type: type,
          username: username
        })
      });
      const result = await response.json();

      if (result.success) {
        const newPostId = result.postId[0].post_id;
        setPostId(newPostId);
        setContent("");
        if (type === "image" || type === "video") {
          try {
            const imgRes = await fetch('http://localhost/ProjectMatchUp/API/uploadMedia.php', {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              credentials: "include",
              body: JSON.stringify({
                post_id: newPostId,
                type: type,
                url: fileUrl,
                action: "insert"
              })
            });

            const imgResult = await imgRes.json();
            if (!imgResult.success) {
              console.error("Failed to upload media", result.error);
            }
          } catch (error) {
            console.error("Error with request", error);
          }
        }
      }
    } catch (error) {
      console.error("Could not upload post", error);
    }
  };

  return (
    <div className="flex flex-col w-full sm:w-2/3 md:w-1/2 lg:w-1/3 h-auto border-2 border-gray-300 p-4 rounded-2xl mx-auto mt-4">
      <div className="flex bg-gray-200 w-full h-full overflow-y-auto align-text-top border-2 border-gray-300 rounded-lg">
        <input
          id="ddm"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter What's on your mind"
          className="w-full h-full p-2 border-0 outline-none rounded-lg"
        />
      </div>
      <div className="flex justify-between items-center mt-3">
        <button
          className="w-8 h-8 sm:w-10 sm:h-10 mr-3"
          onClick={() => { setShowModal(true); setType("image"); }}
        >
          <img className="object-contain w-full h-full" src='/gallery.png' alt="Image" />
        </button>
        <button
          className="w-8 h-8 sm:w-10 sm:h-10"
          onClick={() => { setShowModal(true); setType("video"); }}
        >
          <img className="object-contain w-full h-full" src='/multimedia.png' alt="Video" />
        </button>
        <button
          onClick={handleSubmit}
          className="w-auto h-10 px-4 text-sm bg-blue-500 text-white rounded-xl mt-2"
        >
          Submit
        </button>
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg flex flex-col gap-5 w-11/12 sm:w-96">
            <div className="flex justify-between items-center">
              <h4>{type === "image" ? "Upload Image" : "Upload Video"}</h4>
              <button className="self-end" onClick={() => { setShowModal(false); setType("text"); }}>
                <img className='w-10 h-10' src='/cancel.png' alt="Cancel" />
              </button>
            </div>
            <input
              type="file"
              accept={type === "image" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-md"
            />
            <button onClick={handleUpload} className="bg-red-400 text-white p-2 rounded-xl">
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostWindow;
