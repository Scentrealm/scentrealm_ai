// /pages/api/socket.js

import { Server } from 'ws';

export default function handler(req, res) {
  if (res.socket.server.wss) {
    console.log('WebSocket Server already running');
    res.end();
    return;
  }

  console.log('Initializing WebSocket Server');
  const wss = new Server({ server: res.socket.server });

  // 监听客户端连接
  wss.on('connection', (ws) => {
    console.log('New client connected');

    // 监听客户端消息
    ws.on('message', (message) => {
      console.log('Received:', message);
      // 给客户端发送回执消息
      ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  res.socket.server.wss = wss;
  res.end();
}
