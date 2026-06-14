import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'linguaverse-secret-key'

export interface AuthRequest extends Request {
  user?: {
    id: number
    username: string
    email: string
  }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: '未提供认证令牌' })
    return
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number
      username: string
      email: string
    }
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    }
    next()
  } catch {
    res.status(401).json({ success: false, error: '令牌无效或已过期' })
  }
}
