import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let clients={};

wss.on('connection',function connection(ws){
    ws.on('message',function incoming(message){
        const data=JSON.parse(message);
        const { type, from, to, text } = data;

        if(type==='init'){
            clients[from]=ws;
        }

        if(type==='message'){
            const sendpayLoad=JSON.stringify({type:"message",from,text,time: new Date().toISOString()});
            if(clients[to]){
                clients[to].send(sendpayLoad);
            }
        }

        if(type==='seen'){
            if(clients[to]){
                clients[to].send(JSON.stringify({type:"seen",from}));
            }
        }

        ws.on('close',()=>{
            for(let user in clients){
                if(clients[user]===ws)delete clients[user];
            }
        })
    })
})
console.log("WebSocket server running on ws://localhost:8080");