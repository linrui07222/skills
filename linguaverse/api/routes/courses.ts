import { Router, type Response } from 'express'
import db from '../database/db.js'
import { type AuthRequest } from '../middleware/auth.js'
import jwt from 'jsonwebtoken'

const router = Router()

/**
 * GET / - 获取课程列表，支持 ?language=en&level=A1 筛选
 */
router.get('/', (req: AuthRequest, res: Response): void => {
  try {
    const { language, level } = req.query

    let sql = 'SELECT * FROM courses WHERE 1=1'
    const params: unknown[] = []

    if (language) {
      sql += ' AND language = ?'
      params.push(language)
    }
    if (level) {
      sql += ' AND level = ?'
      params.push(level)
    }

    sql += ' ORDER BY language, level'

    const courses = db.prepare(sql).all(...params)

    res.json({ success: true, data: courses })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取课程列表失败' })
  }
})

/**
 * GET /:id - 获取课程详情，含 lessons 列表和用户进度
 */
router.get('/:id', (req: AuthRequest, res: Response): void => {
  try {
    const courseId = req.params.id

    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId) as {
      id: number
      title: string
      description: string
      language: string
      level: string
      cover_image: string
      enrolled_count: number
    } | undefined

    if (!course) {
      res.status(404).json({ success: false, error: '课程不存在' })
      return
    }

    const lessons = db.prepare(`
      SELECT id, course_id, title, type, order_num
      FROM lessons WHERE course_id = ? ORDER BY order_num
    `).all(courseId) as {
      id: number
      course_id: number
      title: string
      type: string
      order_num: number
    }[]

    // Get user progress if authenticated
    let userProgress: { lesson_id: number; completed: number; score: number }[] = []
    if (req.headers.authorization) {
      try {
        const authHeader = req.headers.authorization
        if (authHeader.startsWith('Bearer ')) {
          const JWT_SECRET = process.env.JWT_SECRET || 'linguaverse-secret-key'
          const token = authHeader.substring(7)
          const decoded = jwt.verify(token, JWT_SECRET) as { id: number }
          userProgress = db.prepare(`
            SELECT lesson_id, completed, score FROM user_progress
            WHERE user_id = ? AND course_id = ?
          `).all(decoded.id, courseId) as { lesson_id: number; completed: number; score: number }[]
        }
      } catch {
        // Token invalid, just skip user progress
      }
    }

    const progressMap = new Map(userProgress.map(p => [p.lesson_id, p]))

    const lessonsWithProgress = lessons.map(lesson => ({
      ...lesson,
      completed: progressMap.get(lesson.id)?.completed ?? 0,
      score: progressMap.get(lesson.id)?.score ?? 0,
    }))

    res.json({
      success: true,
      data: {
        ...course,
        lessons: lessonsWithProgress,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取课程详情失败' })
  }
})

export default router
