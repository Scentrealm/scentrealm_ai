const AI72_SCENTS = require('../../data/ai72-scents')

const OPENAI_API_URL = 'https://api.openai.com/v1/responses'
const OPENAI_MODEL = process.env.AI72_OPENAI_MODEL || 'gpt-4o-mini'
const OPENAI_TIMEOUT_MS = 25000

const SCENTS_BY_ID = new Map(AI72_SCENTS.map((item) => [Number(item.id), item]))

export const config = {
  maxDuration: 45
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

async function fetchJsonWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    const responseText = await response.text()
    let data
    try {
      data = responseText ? JSON.parse(responseText) : null
    } catch (error) {
      throw new Error(`OpenAI 返回了无法解析的数据（HTTP ${response.status}）`)
    }
    if (!response.ok) {
      const message = data && data.error && data.error.message
      throw new Error(message || `OpenAI 请求失败（HTTP ${response.status}）`)
    }
    return data
  } finally {
    clearTimeout(timer)
  }
}

function extractOutputText(response) {
  if (response && typeof response.output_text === 'string') return response.output_text
  const output = response && Array.isArray(response.output) ? response.output : []
  for (const item of output) {
    if (!item || !Array.isArray(item.content)) continue
    for (const content of item.content) {
      if (content && content.type === 'output_text' && typeof content.text === 'string') {
        return content.text
      }
    }
  }
  return ''
}

function fallbackTitle(text) {
  if (/雨/.test(text)) return '雨停之后'
  if (/海|浪/.test(text)) return '蓝色回声'
  if (/森林|树林|树木/.test(text)) return '林间微光'
  if (/夜|月|星/.test(text)) return '夜色未眠'
  if (/夏|阳光|太阳/.test(text)) return '盛夏留声'
  return text.length > 10 ? `${text.slice(0, 10)}…` : text
}

function pickFallbackScents(text, direction) {
  const matched = []
  for (const scent of AI72_SCENTS) {
    if (scent.keywords.some((keyword) => keyword && text.includes(keyword))) matched.push(scent.id)
    if (matched.length === 2) break
  }

  const directionIds = {
    natural: [757, 497, 1358, 820],
    warm: [1665, 956, 1666, 1997],
    mystery: [1394, 1999, 1665, 1396]
  }
  const candidates = [...matched, ...(directionIds[direction] || directionIds.natural)]
  return [...new Set(candidates)].slice(0, 4)
}

function createFallbackAnalysis(text, direction) {
  const scentIds = pickFallbackScents(text, direction)
  const ratios = scentIds.length === 3 ? [42, 33, 25] : [34, 27, 22, 17]
  const formula = scentIds.map((scentId, index) => {
    const scent = SCENTS_BY_ID.get(scentId)
    return {
      scentId,
      ratio: ratios[index],
      role: index === 0 ? '主体' : index === scentIds.length - 1 ? '点缀' : '连接',
      description: `${scent.name}带来${scent.keywords.slice(0, 2).join('、')}的气味线索，让场景更具体。`
    }
  })
  const names = formula.map((item) => SCENTS_BY_ID.get(item.scentId).name)
  const title = fallbackTitle(text)
  const emotion = direction === 'warm' ? '温暖、柔和' : direction === 'mystery' ? '神秘、富有想象力' : '自然、清晰'
  return {
    title,
    understanding: {
      scene: text.slice(0, 60),
      emotion,
      sensory: `用${names.join('、')}把空气、光线与情绪连接起来`,
      keywords: names.slice(0, 4)
    },
    introduction: `这款气味从“${text.slice(0, 50)}”出发。开场由${names[0]}建立第一印象，随后${names.slice(1, -1).join('与') || names[1]}慢慢铺开空间，最后由${names[names.length - 1]}留下一点清晰的余韵。`,
    formulaExplanation: `${names.join('、')}组成由主体、连接到点缀的嗅觉层次，既保留原始场景的辨识度，也让整体闻起来更完整。`,
    audioText: `你的气味作品叫做${title}。它从${names[0]}开始，${names.slice(1).join('、')}依次展开，把你描述的场景变成一段有前后层次的嗅觉体验。`,
    formula
  }
}

async function createFormulaWithOpenAI({ text, direction }) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY
  if (!apiKey) throw new Error('缺少 OPENAI_API_KEY 或 OPENAI_KEY')

  const catalog = AI72_SCENTS.map(({ id, name, category, keywords }) => ({
    scentId: id,
    name,
    category,
    keywords
  }))

  const response = await fetchJsonWithTimeout(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      store: false,
      instructions: [
        '你是气味王国的资深嗅觉体验设计师，要把观众的一句话转化为可展示的气味配方。',
        '只能从提供的气味目录中选 3 至 6 种，不得发明目录外的气味或 scentId。',
        '配方比例合计必须为 100，每个比例为 5 至 60 的整数。',
        '先理解场景、情绪、空气质感和记忆线索，再选择气味；不要只做关键词机械匹配。',
        '除非用户明确要求，榴莲、消毒水、爆炸、火焰、夜店迷香等强烈气味只可谨慎点缀。',
        '所有文本使用自然、具体、有画面感的中文，不得声称治疗、提神、助眠等医学功效。',
        'introduction 为 90 至 180 个汉字，描述第一印象、展开与余韵。',
        'formulaExplanation 解释配方结构及各气味如何共同还原用户想象。',
        '每个 formula.description 都要说明该原料在这个特定场景里的作用。',
        'audioText 为 70 至 140 个汉字，适合展会现场直接朗读，不要念比例和编号。'
      ].join('\n'),
      input: JSON.stringify({
        userText: text,
        preferredDirection: direction,
        scentCatalog: catalog
      }),
      text: {
        format: {
          type: 'json_schema',
          name: 'ai72_scent_formula',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              title: { type: 'string' },
              understanding: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  scene: { type: 'string' },
                  emotion: { type: 'string' },
                  sensory: { type: 'string' },
                  keywords: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 }
                },
                required: ['scene', 'emotion', 'sensory', 'keywords']
              },
              introduction: { type: 'string' },
              formulaExplanation: { type: 'string' },
              audioText: { type: 'string' },
              formula: {
                type: 'array',
                minItems: 3,
                maxItems: 6,
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    scentId: { type: 'integer', enum: AI72_SCENTS.map((item) => item.id) },
                    ratio: { type: 'integer', minimum: 5, maximum: 60 },
                    role: { type: 'string', enum: ['主体', '连接', '点缀'] },
                    description: { type: 'string' }
                  },
                  required: ['scentId', 'ratio', 'role', 'description']
                }
              }
            },
            required: ['title', 'understanding', 'introduction', 'formulaExplanation', 'audioText', 'formula']
          }
        }
      }
    })
  }, OPENAI_TIMEOUT_MS)

  const outputText = extractOutputText(response)
  if (!outputText) throw new Error('OpenAI 未返回结构化配方')
  return JSON.parse(outputText)
}

function normalizeFormula(rawFormula) {
  const unique = []
  const usedIds = new Set()
  for (const item of Array.isArray(rawFormula) ? rawFormula : []) {
    const scentId = Number(item && item.scentId)
    const scent = SCENTS_BY_ID.get(scentId)
    if (!scent || usedIds.has(scentId)) continue
    usedIds.add(scentId)
    unique.push({
      scent,
      sourceRatio: Math.max(1, Number(item.ratio) || 1),
      role: ['主体', '连接', '点缀'].includes(item.role) ? item.role : '连接',
      description: String(item.description || `${scent.name}构成配方中的一层气味。`).slice(0, 160)
    })
  }
  if (unique.length < 3) return []

  const total = unique.reduce((sum, item) => sum + item.sourceRatio, 0)
  const normalizedRatios = unique.map((item) => Math.round((item.sourceRatio / total) * 100))
  normalizedRatios[0] += 100 - normalizedRatios.reduce((sum, ratio) => sum + ratio, 0)

  return unique.map((item, index) => ({
    sequence: item.scent.sequence,
    scentId: item.scent.id,
    name: item.scent.name,
    category: item.scent.category,
    ratio: normalizedRatios[index],
    note: item.role,
    description: item.description
  }))
}

function toPrescription(formula) {
  return formula.reduce((result, item) => {
    result[String(item.scentId)] = item.ratio
    return result
  }, {})
}

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ code: 405, message: '请使用 POST 方法。' })
    return
  }

  const text = String(req.body && req.body.text || '').trim().slice(0, 200)
  const requestedDirection = String(req.body && req.body.direction || 'natural').trim()
  const direction = ['natural', 'warm', 'mystery'].includes(requestedDirection) ? requestedDirection : 'natural'

  if (!text) {
    res.status(400).json({ code: 400, message: 'text 不能为空。' })
    return
  }

  let analysis
  let enrichment = 'openai'
  try {
    analysis = await createFormulaWithOpenAI({ text, direction })
  } catch (error) {
    console.error('[ai72] OpenAI formula generation failed:', error.message)
    analysis = createFallbackAnalysis(text, direction)
    enrichment = 'fallback'
  }

  let formula = normalizeFormula(analysis.formula)
  if (!formula.length) {
    analysis = createFallbackAnalysis(text, direction)
    formula = normalizeFormula(analysis.formula)
    enrichment = 'fallback'
  }

  res.status(200).json({
    code: 200,
    data: {
      title: analysis.title || fallbackTitle(text),
      understanding: analysis.understanding,
      introduction: analysis.introduction,
      formulaExplanation: analysis.formulaExplanation,
      audioText: analysis.audioText || analysis.introduction,
      formula,
      prescription: toPrescription(formula),
      audio: '',
      released: false,
      previewOnly: true,
      enrichment
    }
  })
}
