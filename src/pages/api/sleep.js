// 睡眠相关免费的设备列表
export default async function handler(req, res) {
  res.status(200).json({
    code: 200,
    msg: 'success',
    success: true,
    data: {
      device: [
        '34:94:54:2b:e2:c2',
        'd4:d4:da:55:5b:aa',
        'd4:d4:da:54:50:da',
        'd4:d4:da:43:33:22',
        'd4:d4:da:53:9d:02',
        'd4:d4:da:59:60:b2',
        '34:94:54:2c:b5:12',
        '34:94:54:2c:b4:f6',
        '34:94:54:2b:e1:f6',
        'd4:d4:da:53:aa:6e',
        '08:d1:f9:12:8c:22',
        '08:d1:f9:12:89:36',
        '78:e3:6d:08:b5:ae',
      ]
    }
  })
}
