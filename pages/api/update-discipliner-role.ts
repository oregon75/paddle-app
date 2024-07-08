import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../../types/jwt'

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

    if (typeof decoded === 'string' || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    const { role } = req.body

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { disciplinerRole: role }
    })

    res.status(200).json({ message: 'Discipliner role updated successfully', role: updatedUser.disciplinerRole })
  } catch (error) {
    console.error('Error updating discipliner role:', error)
    res.status(500).json({ message: 'Error updating discipliner role' })
  }
}