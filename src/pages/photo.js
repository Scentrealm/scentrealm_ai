import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io();

    // 监听来自服务器的消息
    socket.on('message', (msg) => {
      console.log(msg);
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', message); // 向服务器发送消息
    setMessages(prev => [...prev, message]); // 将你的消息添加到聊天记录中
    setMessage(""); // 清空输入框
  };

  return (
    <div>
      <h1>Send command</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="输入消息..."
      />
      <button onClick={sendMessage}>发送</button>
    </div>
  );
}
