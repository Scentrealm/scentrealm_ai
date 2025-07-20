const OpenAI = require('openai')
const util = require('./util')

// const apiKey = process.env.OPENAI_KEY
const apiKey = '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'
const baseURL = 'https://gtapi.xiaoerchaoren.com:8932/v1'
const openai = new OpenAI({ apiKey })

export const config = {
  maxDuration: 20
}

/*
 * 首次提问，将问题返回，在后续的调用中，重新将问题发送
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (req.body && req.body.message) {
      let result = {}
      let { message } = req.body
      let jsonMatch = []
      let success = true
      let isScentQuestion = true
      let originalContent = ''
      let promptArray = []

      console.log('message:------------')
      console.log(message)

      promptArray = [
        {
          "role": "user",
          "content": message,
        },
      ]

      const chatCompletion = await openai.chat.completions.create({
        messages: promptArray,
        model: 'gpt-4',
      })

      console.log(chatCompletion)

      if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length) {
        const markdownText = chatCompletion.choices[0].message.content
        originalContent = markdownText
        console.log('response:------------')
        console.log(markdownText)

        success = true
        result = originalContent
      } else {
        originalContent = ''
        success = false
        result = null
      }

      console.log('result:--------------')
      console.log({
        code: 200,
        success: success,
        data: {
          result
        }
      })

      res.status(200).json({
        code: 200,
        success: success,
        data: {
          ...result,
          original: originalContent
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
