import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('正在启动 socket.io 服务器...');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('用户连接', socket.id);

      socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg); // 将消息发送给所有人，除了发送者
      });

      socket.on('disconnect', () => {
        console.log('用户断开连接', socket.id);
      });
    });
  }
  res.end();
}
