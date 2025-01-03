//  时光机扫码加群
export default async function handler(req, res) {
  res.status(200).json({
    code: 200,
    msg: 'success',
    success: true,
    data: {
      // img: 'https://scenic-qiweiwangguo-com.oss-cn-hangzhou.aliyuncs.com/uploads/web/image/1725951374254-WechatIMG12.jpg',
      img: 'https://res.xiaobo.qiweiwangguo.com/images/20250103/46251735886455250103.png',
      device: [
        '10115',
        '10096',
        '10078',
        '10075',
        '10074',
        '10073',
        '10061',
        '10060',
        '10143',
        '10127',
        '10125',
        '10123',
        '10098',
        '10055'
      ]
    }
  })
}
