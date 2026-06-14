import { Router, type Response } from 'express'
import db from '../database/db.js'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'

const router = Router()

/**
 * GET /:id/content - 获取课程内容
 */
router.get('/:id/content', (req: AuthRequest, res: Response): void => {
  try {
    const lessonId = req.params.id

    const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lessonId) as {
      id: number
      course_id: number
      title: string
      type: string
      order_num: number
      content_json: string
    } | undefined

    if (!lesson) {
      res.status(404).json({ success: false, error: '课程内容不存在' })
      return
    }

    let content: unknown
    try {
      content = JSON.parse(lesson.content_json)
    } catch {
      content = lesson.content_json
    }

    res.json({
      success: true,
      data: {
        id: lesson.id,
        courseId: lesson.course_id,
        title: lesson.title,
        type: lesson.type,
        orderNum: lesson.order_num,
        content,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取课程内容失败' })
  }
})

/**
 * POST /:id/submit - 提交练习结果
 */
router.post('/:id/submit', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const lessonId = parseInt(req.params.id)
    const userId = req.user!.id
    const { answers, timeSpent = 0 } = req.body

    const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lessonId) as {
      id: number
      course_id: number
      title: string
      type: string
      content_json: string
    } | undefined

    if (!lesson) {
      res.status(404).json({ success: false, error: '课程不存在' })
      return
    }

    // Calculate score
    let totalQuestions = 0
    let correctAnswers = 0

    const content = JSON.parse(lesson.content_json)

    if (lesson.type === 'vocabulary') {
      totalQuestions = content.words?.length || 0
      correctAnswers = answers?.correctCount || 0
    } else if (lesson.type === 'grammar') {
      let exerciseCount = 0
      for (const point of (content.grammarPoints || [])) {
        exerciseCount += point.exercises?.length || 0
      }
      totalQuestions = exerciseCount
      correctAnswers = answers?.correctCount || 0
    } else if (lesson.type === 'speaking') {
      totalQuestions = content.sentences?.length || 0
      correctAnswers = answers?.correctCount || 0
    } else if (lesson.type === 'listening') {
      totalQuestions = content.questions?.length || 0
      correctAnswers = answers?.correctCount || 0
    }

    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    const completed = score >= 60 ? 1 : 0

    // Calculate XP: 10 XP per correct answer + 50 XP bonus for completing
    let xpEarned = correctAnswers * 10
    if (completed) {
      xpEarned += 50
    }

    // Update or insert user_progress
    const existingProgress = db.prepare(
      'SELECT id FROM user_progress WHERE user_id = ? AND lesson_id = ?'
    ).get(userId, lessonId) as { id: number } | undefined

    if (existingProgress) {
      db.prepare(`
        UPDATE user_progress
        SET completed = MAX(completed, ?), score = MAX(score, ?), time_spent = time_spent + ?,
            completed_at = CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE completed_at END
        WHERE user_id = ? AND lesson_id = ?
      `).run(completed, score, timeSpent, completed, userId, lessonId)
    } else {
      db.prepare(`
        INSERT INTO user_progress (user_id, lesson_id, course_id, completed, score, time_spent, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE NULL END)
      `).run(userId, lessonId, lesson.course_id, completed, score, timeSpent, completed)
    }

    // Update user XP and level
    const user = db.prepare('SELECT xp, level FROM users WHERE id = ?').get(userId) as {
      xp: number
      level: number
    }

    const newXp = user.xp + xpEarned
    const newLevel = Math.floor(newXp / 200) + 1

    // Update streak
    const today = new Date().toISOString().split('T')[0]
    const lastStudy = db.prepare('SELECT last_study_date FROM users WHERE id = ?').get(userId) as {
      last_study_date: string | null
    }

    let newStreak = 0
    if (lastStudy.last_study_date === today) {
      // Already studied today, keep current streak
      newStreak = (db.prepare('SELECT streak FROM users WHERE id = ?').get(userId) as { streak: number }).streak
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      if (lastStudy.last_study_date === yesterday) {
        newStreak = (db.prepare('SELECT streak FROM users WHERE id = ?').get(userId) as { streak: number }).streak + 1
      } else {
        newStreak = 1
      }
    }

    db.prepare(`
      UPDATE users SET xp = ?, level = ?, streak = ?, last_study_date = ? WHERE id = ?
    `).run(newXp, newLevel, newStreak, today, userId)

    // Check and update achievements
    checkAchievements(userId)

    res.json({
      success: true,
      data: {
        score,
        correctAnswers,
        totalQuestions,
        completed: completed === 1,
        xpEarned,
        newLevel,
        newStreak,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '提交练习结果失败' })
  }
})

function checkAchievements(userId: number): void {
  // Get completed lessons count
  const completedLessons = db.prepare(
    'SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND completed = 1'
  ).get(userId) as { count: number }

  // Get streak
  const userStats = db.prepare('SELECT streak, xp FROM users WHERE id = ?').get(userId) as {
    streak: number
    xp: number
  }

  // Get lesson type counts
  const vocabularyLessons = db.prepare(`
    SELECT COUNT(*) as count FROM user_progress up
    JOIN lessons l ON up.lesson_id = l.id
    WHERE up.user_id = ? AND up.completed = 1 AND l.type = 'vocabulary'
  `).get(userId) as { count: number }

  const grammarLessons = db.prepare(`
    SELECT COUNT(*) as count FROM user_progress up
    JOIN lessons l ON up.lesson_id = l.id
    WHERE up.user_id = ? AND up.completed = 1 AND l.type = 'grammar'
  `).get(userId) as { count: number }

  const speakingLessons = db.prepare(`
    SELECT COUNT(*) as count FROM user_progress up
    JOIN lessons l ON up.lesson_id = l.id
    WHERE up.user_id = ? AND up.completed = 1 AND l.type = 'speaking'
  `).get(userId) as { count: number }

  const listeningLessons = db.prepare(`
    SELECT COUNT(*) as count FROM user_progress up
    JOIN lessons l ON up.lesson_id = l.id
    WHERE up.user_id = ? AND up.completed = 1 AND l.type = 'listening'
  `).get(userId) as { count: number }

  // Get posts count
  const postsCount = db.prepare(
    'SELECT COUNT(*) as count FROM posts WHERE user_id = ?'
  ).get(userId) as { count: number }

  // Update achievements
  const achievementUpdates: { category: string; progress: number }[] = [
    { category: 'learning', progress: completedLessons.count },
    { category: 'streak', progress: userStats.streak },
    { category: 'vocabulary', progress: vocabularyLessons.count * 10 },
    { category: 'grammar', progress: grammarLessons.count },
    { category: 'speaking', progress: speakingLessons.count },
    { category: 'listening', progress: listeningLessons.count },
    { category: 'community', progress: postsCount.count },
    { category: 'xp', progress: userStats.xp },
  ]

  const updateAchievement = db.prepare(`
    UPDATE user_achievements
    SET progress = ?, unlocked = CASE WHEN progress >= (SELECT target_value FROM achievements WHERE id = user_achievements.achievement_id) THEN 1 ELSE 0 END,
        unlocked_at = CASE WHEN unlocked = 0 AND progress >= (SELECT target_value FROM achievements WHERE id = user_achievements.achievement_id) THEN CURRENT_TIMESTAMP ELSE unlocked_at END
    WHERE user_id = ? AND achievement_id IN (SELECT id FROM achievements WHERE category = ?)
  `)

  for (const update of achievementUpdates) {
    updateAchievement.run(update.progress, userId, update.category)
  }
}

export default router
