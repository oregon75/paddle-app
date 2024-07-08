import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../../types/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

    if (typeof decoded === 'string' || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (req.method === 'POST') {
      const { name, description, points, disciplineeId } = req.body

      if (user.role !== 'DISCIPLINER') {
        return res.status(403).json({ message: 'Not authorized' })
      }

      const reward = await prisma.reward.create({
        data: {
          name,
          description,
          points,
          userId: disciplineeId
        }
      })

      res.status(201).json(reward)
    } else if (req.method === 'GET') {
      const { disciplineeId } = req.query

      if (user.role === 'DISCIPLINER') {
        if (!disciplineeId) {
          return res.status(400).json({ message: 'Disciplinee ID is required' })
        }

        const rewards = await prisma.reward.findMany({
          where: { userId: disciplineeId as string }
        })

        res.status(200).json(rewards)
      } else if (user.role === 'DISCIPLINEE') {
        const rewards = await prisma.reward.findMany({
          where: { userId: user.id }
        })

        res.status(200).json(rewards)
      } else {
        res.status(403).json({ message: 'Not authorized' })
      }
    } else if (req.method === 'PATCH') {
      const { rewardId } = req.body

      if (user.role !== 'DISCIPLINEE') {
        return res.status(403).json({ message: 'Not authorized' })
      }

      const reward = await prisma.reward.update({
        where: { id: rewardId },
        data: { isRedeemed: true }
      })

      res.status(200).json(reward)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error handling rewards:', error)
    res.status(500).json({ message: 'Error handling rewards' })
  }
}