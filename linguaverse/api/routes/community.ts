import { Router, type Response } from 'express'
import db from '../database/db.js'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'

const router = Router()

/**
 * GET /posts - 获取帖子列表
 */
router.get('/posts', (req: AuthRequest, res: Response): void => {
  try {
    const { language } = req.query

    let sql = `
      SELECT p.*, u.username, u.avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `
    const params: unknown[] = []

    if (language) {
      sql += ' AND p.language = ?'
      params.push(language)
    }

    sql += ' ORDER BY p.created_at DESC'

    const posts = db.prepare(sql).all(...params)

    res.json({ success: true, data: posts })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取帖子列表失败' })
  }
})

/**
 * POST /posts - 发布新帖子
 */
router.post('/posts', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id
    const { content, language } = req.body

    if (!content || !language) {
      res.status(400).json({ success: false, error: '请提供内容和语言类型' })
      return
    }

    if (!['en', 'ja', 'ko'].includes(language)) {
      res.status(400).json({ success: false, error: '语言类型无效，仅支持 en/ja/ko' })
      return
    }

    const result = db.prepare(`
      INSERT INTO posts (user_id, content, language) VALUES (?, ?, ?)
    `).run(userId, content, language)

    const post = db.prepare(`
      SELECT p.*, u.username, u.avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).get(result.lastInsertRowid)

    res.status(201).json({ success: true, data: post })
  } catch (error) {
    res.status(500).json({ success: false, error: '发布帖子失败' })
  }
})

/**
 * POST /posts/:id/like - 点赞
 */
router.post('/posts/:id/like', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const postId = req.params.id

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId) as {
      id: number
      likes: number
    } | undefined

    if (!post) {
      res.status(404).json({ success: false, error: '帖子不存在' })
      return
    }

    db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(postId)

    const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId)

    res.json({ success: true, data: updatedPost })
  } catch (error) {
    res.status(500).json({ success: false, error: '点赞失败' })
  }
})

export default router
