import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../../types/jwt'

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

    const disciplinees = await prisma.user.findMany({
      where: { 
        disciplinerId: user.id
      },
      select: { 
        id: true, 
        name: true, 
        email: true,
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            intensity: true,
            isEnabled: true,
            dueDate: true,
            completionDate: true,
            sortOrder: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        },
        underwearAssignments: {
          select: {
            id: true,
            date: true,
            underwear: true
          },
          orderBy: {
            date: 'desc'
          }
        },
        chastityAssignments: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            isTimerVisible: true
          },
          orderBy: {
            startDate: 'desc'
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