export default async function handler(req, res) {
  res.status(200).json({
    code: 200,
    msg: 'success',
    success: true,
    page: {
      n: 2000,
      total: 34,
      last_page: 1,
      current_page: 1,
    },
    data: [
      '08:D1:F9:12:E8:4E',
    ]
  })
}
