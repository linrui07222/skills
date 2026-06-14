import { Router, type Response } from 'express'
import db from '../database/db.js'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'

const router = Router()

/**
 * GET / - 获取当前用户的学习进度
 */
router.get('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id

    // Get user basic stats
    const user = db.prepare('SELECT level, xp, streak, last_study_date FROM users WHERE id = ?').get(userId) as {
      level: number
      xp: number
      streak: number
      last_study_date: string | null
    }

    // Calculate longest streak from user_progress data
    const progressDates = db.prepare(`
      SELECT DISTINCT DATE(completed_at) as date
      FROM user_progress WHERE user_id = ? AND completed = 1 AND completed_at IS NOT NULL
      ORDER BY date
    `).all(userId) as { date: string }[]

    let longestStreak = 0
    let currentStreak = 1
    for (let i = 1; i < progressDates.length; i++) {
      const prev = new Date(progressDates[i - 1].date)
      const curr = new Date(progressDates[i].date)
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000)
      if (diffDays === 1) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, user.streak, 1)

    // Weekly minutes - last 7 days daily study minutes
    const weeklyMinutes: number[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      const result = db.prepare(`
        SELECT COALESCE(SUM(time_spent), 0) as total
        FROM user_progress
        WHERE user_id = ? AND DATE(completed_at) = ?
      `).get(userId, date) as { total: number }
      weeklyMinutes.push(Math.round(result.total / 60))
    }

    // Skills breakdown
    const vocabularyProgress = db.prepare(`
      SELECT COUNT(*) as count FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      WHERE up.user_id = ? AND up.completed = 1 AND l.type = 'vocabulary'
    `).get(userId) as { count: number }

    const grammarProgress = db.prepare(`
      SELECT COUNT(*) as count FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      WHERE up.user_id = ? AND up.completed = 1 AND l.type = 'grammar'
    `).get(userId) as { count: number }

    const speakingProgress = db.prepare(`
      SELECT COUNT(*) as count FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      WHERE up.user_id = ? AND up.completed = 1 AND l.type = 'speaking'
    `).get(userId) as { count: number }

    const listeningProgress = db.prepare(`
      SELECT COUNT(*) as count FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      WHERE up.user_id = ? AND up.completed = 1 AND l.type = 'listening'
    `).get(userId) as { count: number }

    const totalLessons = db.prepare('SELECT COUNT(*) as count FROM lessons').get() as { count: number }

    const skills = {
      listening: Math.min(100, Math.round((listeningProgress.count / Math.max(totalLessons.count / 4, 1)) * 100)),
      speaking: Math.min(100, Math.round((speakingProgress.count / Math.max(totalLessons.count / 4, 1)) * 100)),
      reading: Math.min(100, Math.round((vocabularyProgress.count / Math.max(totalLessons.count / 4, 1)) * 100)),
      writing: Math.min(100, Math.round((grammarProgress.count / Math.max(totalLessons.count / 4, 1)) * 100)),
    }

    // Recent activities
    const recentActivities = db.prepare(`
      SELECT up.id, up.lesson_id, up.completed, up.score, up.completed_at,
             l.title as lesson_title, l.type as lesson_type,
             c.title as course_title, c.language as course_language
      FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      JOIN courses c ON up.course_id = c.id
      WHERE up.user_id = ?
      ORDER BY up.completed_at DESC
      LIMIT 10
    `).all(userId) as {
      id: number
      lesson_id: number
      completed: number
      score: number
      completed_at: string
      lesson_title: string
      lesson_type: string
      course_title: string
      course_language: string
    }[]

    // Calendar data - last 30 days
    const calendarData: { date: string; minutes: number; lessonsCompleted: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      const dayData = db.prepare(`
        SELECT COALESCE(SUM(time_spent), 0) as total_time,
               SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_count
        FROM user_progress
        WHERE user_id = ? AND DATE(completed_at) = ?
      `).get(userId, date) as { total_time: number; completed_count: number }
      calendarData.push({
        date,
        minutes: Math.round(dayData.total_time / 60),
        lessonsCompleted: dayData.completed_count || 0,
      })
    }

    res.json({
      success: true,
      data: {
        totalXP: user.xp,
        level: user.level,
        streak: user.streak,
        longestStreak,
        weeklyMinutes,
        skills,
        recentActivities,
        calendarData,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取学习进度失败' })
  }
})

export default router
