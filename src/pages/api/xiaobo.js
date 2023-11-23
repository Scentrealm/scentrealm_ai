// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const OpenAI = require('openai')
const apiKey = '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'
const openai = new OpenAI({ apiKey })

export const config = {
  maxDuration: 30
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (req.body && req.body.message && req.body.scents) {
      let result = {}
      let { message, scents, names } = req.body
      let jsonMatch = []
      let success = true

      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            "role": "user",
            "content": "我现在有一款蓝牙设备，设备包含6支不同的香氛胶囊，可以通过发送蓝牙指令控制释放其中的一支或多支，譬如，其中有一支胶囊是 “薄荷” 气味，我可以通过蓝牙指令控制释放“薄荷” 气味 1分钟"
          },
          {
            "role": "assistant",
            "content": "您描述的蓝牙设备听起来非常有趣和创新。这种设备通常由一个蓝牙模块和多个香氛胶囊组成。通过蓝牙模块，您可以远程发送指令来控制胶囊的释放。在您的例子中，如果想要释放“薄荷”气味，您可以通过与设备配对的手机或其他智能设备发送特定的蓝牙指令。"
          },
          {
            "role": "user",
            "content": "我现在有一个程序，提供1个函数, 多路播放 mixedPlay(smellsArray), smellsArray 是香氛的数组，譬如 [{\"channelId\": 1, \"time\": 300}, {\"channelId\": 3, \"time\": 200}]，这个意思是通道1 播放300毫秒，通道3播放200毫秒。"
          },
          {
            "role": "assistant",
            "content": "您的程序设计听起来非常有趣，它为控制香氛释放提供了灵活的方法。您提到的函数 mixedPlay(smellsArray) 可以用于控制多个香氛通道的播放"
          },
          {
            "role": "user",
            "content": "假如说我告诉你6个通道的气味，按照顺序是 桂花、水蜜桃、草莓、天竺葵、薰衣草、苹果，另外我给这6个气味取了6种不同的产品名，分别是 桂花、人间水蜜桃、天真浪漫、天竺葵、紫色梦境、平平安安。然后我告诉你我的需求，你可以将其转换为我的程序可以理解的语言吗，返回函数名和参数"
          },
          {
            "role": "assistant",
            "content": "当然可以。请告诉我您的具体需求，例如您想要播放哪些香氛，以及每种香氛的播放时间和顺序。根据您提供的香氛通道和播放需求，我将为您提供相应的函数调用和参数。"
          },
          {
            "role": "user",
            "content": "我在开车，请帮我播放一个提神的气味"
          },
          {
            "role": "assistant",
            "content": "当然可以。通常，薄荷和柑橘类的气味都有助于提神醒脑。在你的香氛选择内，我们可以选择薰衣草，虽然它是放松和助眠的气味，但是我们不会让它播放很久，不会起到助眠的效果。使用mixedPlay函数播放第5通道的薰衣草气味可能是一个好选择，下面是对应的函数和参数：\```javascript mixedPlay([{\"channelId\": 5, \"time\": 6000}]);\```"
          },
          {
            "role": "user",
            "content": "可以将输出结果简化一些吗，因为我想把你输出的结果转化为音频，表示对用户的一个回应，因此我只需要2个信息： 1. 函数的代码。 2. 你对这个结果的一些描述。 我会把你的描述当做一个音频告知用户"
          },
          {
            "role": "assistant",
            "content": "当然可以。以下是简化后的输出结果：1. **函数代码**:```javascript mixedPlay([{\"channelId\": 5, \"time\": 60000}]);```2. **描述**:\"正在播放薰衣草香氛，持续时间60秒，以帮助您提神。\""
          },
          {
            "role": "user",
            "content": `我的设备气味胶囊是：${scents}，对应的产品名字是：${names}。${message}。请将结果输出为 JSON 格式 {"code": "", "description": "", "remark": ""}，这样我方便获取`
          }
        ],
        model: 'gpt-4',
      })

      if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length) {
        const markdownText = chatCompletion.choices[0].message.content

        // if (markdownText.indexOf('```json') >= 0 || markdownText.indexOf('```javascript') >= 0) {
        //   jsonMatch = markdownText.match(/```(json|javascript)\n([\s\S]*?)\n```/)
        // } else {
        jsonMatch = markdownText.match(/```([\s\S]*?)```/)
        // }

        console.log(markdownText)
        console.log('--------------')
        if (jsonMatch && jsonMatch.length) {
          let jsonString = jsonMatch[jsonMatch.length - 1]
          let jsonIndex = jsonString.indexOf('{')
          let jsonEndIndex = jsonString.lastIndexOf('}')
          let resultStr = jsonString.substring(jsonIndex, jsonEndIndex + 1)

          try {
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
            result = JSON.parse(resultStr)
          } catch (e) {
            result = null
            success = false
          }

          console.log(resultStr)
          console.log('--------------')
          console.log(result)
        } else {
          result = null
          success = false
        }
      } else {
        result = null
        success = false
      }

      res.status(200).json({
        code: 200,
        success: success,
        data: {
          ...result
        }
      })
    } else {
      res.status(200).json({
        code: 200,
        success: false,
        message: 'message/scents field are required.'
      })
    }
  } else {
    res.status(200).json({
      code: 200,
      success: false,
      message: 'use POST method instead.'
    })
  }
}
