import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../../../types/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user || user.role !== 'DISCIPLINER') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const { id } = req.query
    const { status } = req.body

    const updatedTask = await prisma.task.update({
      where: { id: id as string },
      data: { status }
    })

    res.status(200).json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ message: 'Error updating task' })
  }
}