export default async function handler(req, res) {
  res.status(200).json({
    code: 200,
    msg: 'success',
    success: true,
    data: [10115, 10096, 10078, 10075, 10074, 10073, 10061, 10060, 10143, 10127, 10125, 10123, 10098, 10055]
  })
}
