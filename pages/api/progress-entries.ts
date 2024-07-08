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
      const { note, rating, disciplineeId } = req.body

      if (user.role !== 'DISCIPLINER') {
        return res.status(403).json({ message: 'Not authorized' })
      }

      const progressEntry = await prisma.progressEntry.create({
        data: {
          note,
          rating,
          userId: disciplineeId
        }
      })

      res.status(201).json(progressEntry)
    } else if (req.method === 'GET') {
      const { disciplineeId } = req.query

      if (user.role === 'DISCIPLINER') {
        if (!disciplineeId) {
          return res.status(400).json({ message: 'Disciplinee ID is required' })
        }

        const progressEntries = await prisma.progressEntry.findMany({
          where: { userId: disciplineeId as string },
          orderBy: { date: 'desc' }
        })

        res.status(200).json(progressEntries)
      } else if (user.role === 'DISCIPLINEE') {
        const progressEntries = await prisma.progressEntry.findMany({
          where: { userId: user.id },
          orderBy: { date: 'desc' }
        })

        res.status(200).json(progressEntries)
      } else {
        res.status(403).json({ message: 'Not authorized' })
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error handling progress entries:', error)
    res.status(500).json({ message: 'Error handling progress entries' })
  }
}