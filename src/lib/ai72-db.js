const crypto = require('crypto')
const mysql = require('mysql2/promise')

const DEFAULT_DB_CONFIG = {
  host: 'rdsuf5mqwljzynpys5pwpeo.mysql.rds.aliyuncs.com',
  user: 'smart_device',
  database: 'smart_device'
}

function getPool() {
  if (globalThis.__ai72MySqlPool) return globalThis.__ai72MySqlPool

  const password = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD
  if (!password) throw new Error('缺少 MYSQL_PASSWORD 或 DB_PASSWORD')

  globalThis.__ai72MySqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST || DEFAULT_DB_CONFIG.host,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || DEFAULT_DB_CONFIG.user,
    password,
    database: process.env.MYSQL_DATABASE || DEFAULT_DB_CONFIG.database,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 5),
    queueLimit: 0,
    connectTimeout: 10000,
    enableKeepAlive: true,
    dateStrings: true
  })
  return globalThis.__ai72MySqlPool
}

function createShareCode() {
  return crypto.randomBytes(9).toString('hex')
}

function parseJson(value, fallback) {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch (error) {
    return fallback
  }
}

async function saveCreation(data) {
  const pool = getPool()
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const shareCode = createShareCode()
    try {
      const [result] = await pool.execute(
        `INSERT INTO ai72_scent_creations
          (share_code, client_id, device_mac, user_input, direction, title, scent_story,
           formula_json, prescription_json, understanding_json, model, generation_source)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          shareCode,
          data.clientId || null,
          data.deviceMac || null,
          data.userInput,
          data.direction,
          data.title,
          data.scentStory,
          JSON.stringify(data.formula),
          JSON.stringify(data.prescription),
          JSON.stringify(data.understanding || null),
          data.model || null,
          data.generationSource || 'openai'
        ]
      )
      return { recordId: Number(result.insertId), shareCode }
    } catch (error) {
      if (error.code !== 'ER_DUP_ENTRY' || attempt === 2) throw error
    }
  }
  throw new Error('无法生成唯一分享编号')
}

async function getSharedCreation(shareCode) {
  const pool = getPool()
  const [rows] = await pool.execute(
    `SELECT id, share_code, user_input, direction, title, scent_story, formula_json,
            prescription_json, understanding_json, model, generation_source, share_count, created_at
       FROM ai72_scent_creations
      WHERE share_code = ?
      LIMIT 1`,
    [shareCode]
  )
  if (!rows.length) return null

  await pool.execute(
    'UPDATE ai72_scent_creations SET share_count = share_count + 1 WHERE id = ?',
    [rows[0].id]
  )

  const row = rows[0]
  return {
    recordId: Number(row.id),
    shareCode: row.share_code,
    userInput: row.user_input,
    direction: row.direction,
    title: row.title,
    introduction: row.scent_story,
    audioText: row.scent_story,
    formula: parseJson(row.formula_json, []),
    prescription: parseJson(row.prescription_json, {}),
    understanding: parseJson(row.understanding_json, null),
    model: row.model,
    enrichment: row.generation_source,
    shareCount: Number(row.share_count) + 1,
    createdAt: row.created_at,
    previewOnly: true,
    released: false,
    audio: ''
  }
}

async function saveFeedback({ shareCode, clientId, feedback }) {
  const pool = getPool()
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [result] = await connection.execute(
      `INSERT INTO ai72_scent_feedback (creation_id, client_id, feedback)
       SELECT id, ?, ? FROM ai72_scent_creations WHERE share_code = ?
       ON DUPLICATE KEY UPDATE feedback = VALUES(feedback), updated_at = CURRENT_TIMESTAMP`,
      [clientId, feedback, shareCode]
    )
    if (!result.affectedRows) {
      await connection.rollback()
      return false
    }
    await connection.execute(
      'UPDATE ai72_scent_creations SET feedback = ?, feedback_at = NOW() WHERE share_code = ?',
      [feedback, shareCode]
    )
    await connection.commit()
    return true
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

module.exports = {
  getSharedCreation,
  saveCreation,
  saveFeedback
}
