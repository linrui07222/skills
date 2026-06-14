import { Router, type Response } from 'express'
import db from '../database/db.js'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'

const router = Router()

/**
 * GET / - 获取所有成就及当前用户的解锁状态
 */
router.get('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id

    const achievements = db.prepare(`
      SELECT a.*, ua.unlocked, ua.progress, ua.unlocked_at
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
      ORDER BY a.category, a.id
    `).all(userId) as {
      id: number
      title: string
      description: string
      icon: string
      category: string
      target_value: number
      unlocked: number
      progress: number
      unlocked_at: string | null
    }[]

    // Leaderboard - top users by XP
    const leaderboard = db.prepare(`
      SELECT id, username, avatar, level, xp, streak
      FROM users
      ORDER BY xp DESC
      LIMIT 10
    `).all()

    res.json({
      success: true,
      data: {
        achievements: achievements.map(a => ({
          ...a,
          unlocked: a.unlocked === 1,
          progress: a.progress || 0,
        })),
        leaderboard,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取成就数据失败' })
  }
})

export default router
