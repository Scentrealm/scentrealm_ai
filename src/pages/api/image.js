const util = require('./util')

export const config = {
  maxDuration: 20
}

/*
 * 首次提问，将问题返回，在后续的调用中，重新将问题发送
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (req.body && req.body.image && req.body.text) {
      let result = {}
      let { image, text } = req.body
      const txtPrompt1 = 'Replace the background with an apple background.'
      const txtPrompt2 = 'Replace the background with a jasmine flower background.'
      const txtPrompt3 = 'Replace the background with lots of watermelons.'
      const txtPrompt4 = 'Replace the background with oranges.'
      const txtPromptArray = [txtPrompt1, txtPrompt2, txtPrompt3, txtPrompt4]
      const randomIndex = parseInt(Math.random() * txtPromptArray.length);

      const formData = new FormData();
      formData.append('image', image);
      formData.append('text', txtPromptArray[randomIndex]);

      const resp = await fetch('https://api.deepai.org/api/image-editor', {
        method: 'POST',
        headers: {
          'api-key': '263af503-2310-4063-96c4-1e59ed763671'
        },
        body: formData
      });

      res.status(200).json({
        code: 200,
        success: true,
        data: resp,
      })
    }
  }
}
