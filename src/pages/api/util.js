// 格式化 json
export const formatJSON = (resultStr) => {
  let result = {}
  let success = true

  try {
    result = JSON.parse(resultStr)
  } catch (e) {
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
