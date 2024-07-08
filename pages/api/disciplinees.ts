import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user || user.role !== 'DISCIPLINER') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const disciplinees = await prisma.user.findMany({
      where: { 
        OR: [
          { role: 'DISCIPLINEE', disciplinerId: user.id },
          { role: 'DISCIPLINEE', disciplinerId: null }
        ]
      },
      select: { 
        id: true, 
        name: true, 
        email: true,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }
    })

    res.status(200).json(disciplinees)
  } catch (error) {
    console.error('Error fetching disciplinees:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
}