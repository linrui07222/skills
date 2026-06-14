import { Router, type Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../database/db.js'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'linguaverse-secret-key'
const JWT_EXPIRES_IN = '7d'

/**
 * POST /register - 用户注册
 */
router.post('/register', (req: AuthRequest, res: Response): void => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      res.status(400).json({ success: false, error: '请提供用户名、邮箱和密码' })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, error: '密码长度至少6位' })
      return
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username) as { id: number } | undefined
    if (existingUser) {
      res.status(409).json({ success: false, error: '用户名或邮箱已存在' })
      return
    }

    const passwordHash = bcrypt.hashSync(password, 10)

    const result = db.prepare(`
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `).run(username, email, passwordHash)

    const userId = Number(result.lastInsertRowid)

    // Initialize user achievements
    const achievements = db.prepare('SELECT id FROM achievements').all() as { id: number }[]
    const insertUserAchievement = db.prepare(`
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)
    `)
    const initAchievements = db.transaction(() => {
      for (const achievement of achievements) {
        insertUserAchievement.run(userId, achievement.id)
      }
    })
    initAchievements()

    const token = jwt.sign({ id: userId, username, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: userId, username, email },
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '注册失败，请稍后重试' })
  }
})

/**
 * POST /login - 用户登录
 */
router.post('/login', (req: AuthRequest, res: Response): void => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ success: false, error: '请提供邮箱和密码' })
      return
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as {
      id: number
      username: string
      email: string
      password_hash: string
    } | undefined

    if (!user) {
      res.status(401).json({ success: false, error: '邮箱或密码错误' })
      return
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password_hash)
    if (!isPasswordValid) {
      res.status(401).json({ success: false, error: '邮箱或密码错误' })
      return
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, username: user.username, email: user.email },
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '登录失败，请稍后重试' })
  }
})

/**
 * GET /me - 获取当前用户信息
 */
router.get('/me', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const user = db.prepare(`
      SELECT id, username, email, avatar, level, xp, streak, last_study_date, created_at
      FROM users WHERE id = ?
    `).get(req.user!.id) as {
      id: number
      username: string
      email: string
      avatar: string
      level: number
      xp: number
      streak: number
      last_study_date: string | null
      created_at: string
    } | undefined

    if (!user) {
      res.status(404).json({ success: false, error: '用户不存在' })
      return
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取用户信息失败' })
  }
})

export default router
