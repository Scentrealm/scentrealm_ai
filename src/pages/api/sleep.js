// 睡眠相关免费的设备列表
export default async function handler(req, res) {
  res.status(200).json({
    code: 200,
    msg: 'success',
    success: true,
    data: {
      device: [
        'scent3494542be2c2',
        'scentd4d4da555baa',
        'scentd4d4da5450da',
        'scentd4d4da433322',
        'scentd4d4da539d02',
        'scentd4d4da5960b2',
        'scent3494542cb512',
        'scent3494542cb4f6',
        'scent3494542be1f6',
        'scentd4d4da53aa6e',
        'scent08d1f9128c22',
        'scent08d1f9128936',
        'scent78e36d08b5ae',
        'scentd4d4da5364a6',
      ]
    }
  })
}
