const fs = require('fs')
const tencentcloud = require("tencentcloud-sdk-nodejs")

const TTSClient = tencentcloud.tts.v20190823.Client

// 实例化要请求产品(以cvm为例)的client对象
const client = new TTSClient({
  // 为了保护密钥安全，建议将密钥设置在环境变量中或者配置文件中，请参考本文凭证管理章节。
  // 硬编码密钥到代码中有可能随代码泄露而暴露，有安全隐患，并不推荐。
  credential: {
    secretId: process.env.TENCENTCLOUD_SECRET_ID,
    secretKey: process.env.TENCENTCLOUD_SECRET_KEY,
  },
  // 产品地域
  region: "ap-shanghai",
  // 可选配置实例
  profile: {
    signMethod: "TC3-HMAC-SHA256", // 签名方法
    httpProfile: {
      reqMethod: "POST", // 请求方法
      reqTimeout: 30, // 请求超时时间，默认60s
    },
  },
})

export default async function handler(req, res) {
  let param = {
    "Text": "正在播放薰衣草气味,这种气味可以帮助您在驾驶过程中保持清醒和精神饱满，播放时间为60秒。",
    "SessionId": '',
    "VoiceType": 1001,
    "ModelType": 1,
    "Speed": 1,
    "Volume": 6
  }

  let tmp = await client.TextToVoice(param)

  fs.writeFileSync("/Users/limeng/Desktop/project/gitproject/qiweiwangguo/xxx.wav", Buffer.from(tmp.Audio, "base64"))

  res.status(200).json({
    code: 200,
    success: false,
    message: 'use POST method instead.'
  })
}
