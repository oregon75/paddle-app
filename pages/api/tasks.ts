import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../../types/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

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

    const discipliner = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!discipliner || discipliner.role !== 'DISCIPLINER') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (req.method === 'POST') {
      const { title, description, intensity, isEnabled, dueDate, disciplineeId, sortOrder } = req.body

      const task = await prisma.task.create({
        data: {
          title,
          description,
          intensity,
          isEnabled,
          dueDate: dueDate ? new Date(dueDate) : null,
          sortOrder,
          userId: disciplineeId
        }
      })

      res.status(201).json(task)
    } else if (req.method === 'GET') {
      const tasks = await prisma.task.findMany({
        where: {
          user: {
            disciplinerId: discipliner.id
          }
        },
        orderBy: {
          sortOrder: 'asc'
        }
      })

      res.status(200).json(tasks)
    }
  } catch (error) {
    console.error('Error handling task:', error)
    res.status(500).json({ message: 'Error handling task' })
  }
}