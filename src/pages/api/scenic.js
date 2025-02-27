//  时光机扫码加群
export default async function handler(req, res) {
  res.status(200).json({
    code: 200,
    msg: 'success',
    success: true,
    data: {
      // img: 'https://scenic-qiweiwangguo-com.oss-cn-hangzhou.aliyuncs.com/uploads/web/image/1725951374254-WechatIMG12.jpg',
      // img: 'https://scenic-qiweiwangguo-com.oss-cn-hangzhou.aliyuncs.com/uploads/web/image/1735886891742-WX20250103-143824%402x.png',
      // img: 'https://scenic-qiweiwangguo-com.oss-cn-hangzhou.aliyuncs.com/uploads/web/image/1737689427908-WechatIMG14.jpg',
      // img: 'https://scenic-qiweiwangguo-com.oss-cn-hangzhou.aliyuncs.com/uploads/web/image/1738813045037-WechatIMG19.jpg',
      img: 'https://scenic-qiweiwangguo-com.oss-cn-hangzhou.aliyuncs.com/uploads/web/image/1740621524290-WechatIMG23.jpg',
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
