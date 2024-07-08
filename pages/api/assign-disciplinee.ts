import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const discipliner = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!discipliner || discipliner.role !== 'DISCIPLINER') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const { disciplineeId } = req.body

    await prisma.user.update({
      where: { id: disciplineeId },
      data: { disciplinerId: discipliner.id }
    })

    res.status(200).json({ message: 'Disciplinee assigned successfully' })
  } catch (error) {
    console.error('Error assigning disciplinee:', error)
    res.status(500).json({ message: 'Error assigning disciplinee' })
  }
}