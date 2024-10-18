import { useEffect, useState } from 'react';

export default function HomePage() {
  const [input, setInput] = useState('');
  let subscribeSocket;
  let sendSocket;

  useEffect(() => {
    // 初始化 WebSocket 客户端连接
    sendSocket = new WebSocket('ws://114.55.232.109:8765/message/send/zhanhui');

    console.log('///')

    // return () => {
    //   sendSocket.close();
    // };
  }, []);

  const sendMessage = () => {
    console.log(sendSocket, input, '/////')
    if (sendSocket && input) {
      console.log(input);
      sendSocket.send(input);
      setInput('');
    }
  };

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>发送消息</button>
    </div>
  );
}
