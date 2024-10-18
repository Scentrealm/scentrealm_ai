import '@/styles/globals.css'
import { useEffect } from "react"

export default function App({ Component, pageProps }) {
  useEffect(() => {
      fetch('/api/socket'); // 初始化 WebSocket 服务器
  }, []);

  return <Component {...pageProps} />
}
