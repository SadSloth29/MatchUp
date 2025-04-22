import { useEffect, useRef } from 'react';
import React from 'react';

const useWebSocket=(username,onMessage)=>{
    const ws=useRef(null);

    useEffect(()=>{
        ws.current= new WebSocket("ws://localhost:8080");

        ws.current.onopen = () => {
            console.log("WebSocket connected");
      
            
            setTimeout(() => {
              if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ type: 'init', from: username }));
              }
            }, 100); 
          };
        ws.current.onmessage= (event)=>{
            const data= JSON.parse(event.data);
            onMessage(data);

        };

        return () => {
            if (ws.current.readyState === WebSocket.OPEN) {
              ws.current.close();
            }
          };
    },[username]);
    return ws;
}
export default useWebSocket;