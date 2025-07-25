import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect } from 'react'

const formatJSON = (resultStr) => {
  let result = {}
  let success = true

  try {
    result = JSON.parse(resultStr)
  } catch (e) {
    console.log('-----', e)
    resultStr = resultStr
      .replace(/'/g, '"')
      .replace(/'code'/g, `"code"`)
      .replace(/"channelId"/g, `'channelId'`)
      .replace(/"time"/g, `'time'`)

    // 匹配一些特殊情况
    if (resultStr.indexOf('\"channelId\"') > 0) {
      resultStr = resultStr.replace(/\"channelId\"/g, `'channelId'`)
    }
    if (resultStr.indexOf('\"time\"') > 0) {
      resultStr = resultStr.replace(/\"time\"/g, `'time'`)
    }

    try {
      result = JSON.parse(resultStr)
    } catch (e) {
      success = false
      result = null
    } finally {}
  }

  // 替换 “香氛” 为 “气味”
  if (result) {
    if (result.description) {
      result.description = result.description.replace(/香氛/g, '气味')
    }
    if (result.remark) {
      result.remark = result.remark.replace(/香氛/g, '气味')
    }
  }

  return { result, success }
}

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  let str = `{
  "code": "mixedPlay([{'channelId': 3, 'time': 60000}, {'channelId': 5, 'time': 60000}]);",
  "description": "播放檀香和广藿香气味，每种香气播放60秒。",
  "remark": "这种配方有助于舒缓您的压力，希望您能够放松下来。
  }`;

    console.log(str)
    console.log(formatJSON(str))

  // // console.log(str);
  // let jsonMatch = str.match(/{([\s\S]*?)\"}/)
  //
  // console.log(jsonMatch)
  // let strIndex = str.indexOf('{')
  // let endIndex = str.lastIndexOf('}')

  // useEffect(() => {
  //   const eventSource = new EventSource('/api/sse');
  //
  //   eventSource.addEventListener('chat', (event) => {
  //     console.log(event.data);
  //   });
  //
  //   return () => {
  //     eventSource.close();
  //   }
  // }, [])

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <p>
            Scentrealm AI.
          </p>
          <div>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className={styles.grid}></div>
      </main>
    </>
  )
}
