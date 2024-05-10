export default async function handler(req, res) {
  res.status(200).json({
    code: 200,
    msg: 'success',
    success: true,
    data: [
      {
        "no": 1,
        "name": "柠檬草",
        "img": "/scents/ningmengcaoheshuweicao.png",
        "color": "#A9DAD7",
        "period": 73500
      },
      {
        "no": 2,
        "name": "小山坡",
        "img": "/scents/xiaoshanpo.png",
        "color": "#C2E593",
        "period": 72000
      },
      {
        "no": 3,
        "name": "柠檬",
        "img": "/scents/ningmeng.png",
        "color": "#C2E593",
        "period": 0
      }
    ]
  })
}
