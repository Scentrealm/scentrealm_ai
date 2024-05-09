export default async function handler(req, res) {
  res.status(200).json({
    code: 200,
    success: true,
    data: {
      audio: "https://res.txiaobo.qiweiwangguo.com/uploads/speech/112/43781715236624.mp3",
      code: 'mixedPlay([{"channelId": 3, "time": 60000}]);'
    }
  })
}
