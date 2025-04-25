import React from 'react'
import { useEffect, useState } from 'react';
import useWebSocket from '../Server/useWebSocket';
const MessageWindow = ({username,chatWith}) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const ws = useWebSocket(username, (data) => {
    if (data.type === 'message') {
      setMessages((prev) => [...prev, { from: data.from, text: data.text, time: data.time }]);
    } else if (data.type === 'seen') {
      console.log(`${data.from} saw your messages.`);
    }
  });
  useEffect(() => {
    const loadChatHistory = async () => {
      const response = await fetch("http://localhost/ProjectMatchUp/API/fetch_messages.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: username, to: chatWith.username }),
      });
      const result = await response.json();
      if (result.success) {
        setMessages(result.messages);
      } else {
        console.error(result.error);
      }
    };
  
    if (username && chatWith?.username) {
      loadChatHistory();
    }
  }, [username, chatWith]);
  const sendMessage = async () => {
    const msg = { type: 'message', from: username, to: chatWith.username, text };
    ws.current.send(JSON.stringify(msg));

    await fetch("http://localhost/ProjectMatchUp/API/save_message.php", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });

    setMessages((prev) => [...prev, { from: username, text, time: new Date().toISOString() }]);
    setText('');
  };
  const deleteMessage = async (index, message) => {
    console.log(message);
    const response=await fetch("http://localhost/ProjectMatchUp/API/delete_message.php", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: message.from,
        to: chatWith.username,
        text: message.text,
        
      }),
    });
    const result=await response.json();
    if(result.success){
      alert("Text successfully deleted");
    }else{
      alert(result.error);
    }
    
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };
  
  const reportMessage = async (message) => {

    await fetch("http://localhost/ProjectMatchUp/API/report_message.php", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reporter: username,
        offender: message.from,
        text: message.text,
        time: message.time,
      }),
    });
  
    alert("Message reported.");
  };
  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-md">
      {/* Chat With Header */}
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">
        Chat with {chatWith.username}
      </h2>
  
      {/* Message List */}
      <div className="h-72 overflow-y-scroll border rounded-lg p-4 bg-gray-100 space-y-2 mb-4">
      {messages.map((msg, index) => (
  <div
    key={index}
    className={`flex flex-col items-${
      msg.from === username ? 'end' : 'start'
    }`}
  >
    <div
      className={`inline-block px-4 py-2 rounded-2xl text-sm max-w-[80%] ${
        msg.from === username
          ? 'bg-blue-500 text-white rounded-br-none'
          : 'bg-gray-300 text-gray-800 rounded-bl-none'
      }`}
    >
      <b className="block text-xs opacity-70">{msg.from}:</b>
      {msg.text}
    </div>

    <div className="text-xs mt-1 flex gap-3 text-gray-500">
      {msg.from === username && (
        <button
          onClick={() => deleteMessage(index, msg)}
          className="hover:underline text-red-500"
        >
          Delete
        </button>
      )}
      {msg.from !== username && (
        <button
          onClick={() => reportMessage(msg)}
          className="hover:underline text-yellow-600"
        >
          Report
        </button>
      )}
    </div>
  </div>
))}
      </div>
  
      {/* Input + Send */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageWindow