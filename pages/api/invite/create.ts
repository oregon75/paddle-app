import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { Role } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // TODO: Add proper authentication to ensure only admins/discipliners can create invite codes
  const { role } = req.body

  if (!role || !Object.values(Role).includes(role)) {
    return res.status(400).json({ message: 'Invalid role' })
  }

  try {
    const inviteCode = await prisma.inviteCode.create({
      data: {
        code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        role: role as Role,
        createdBy: 'SYSTEM', // Replace with actual user ID when authentication is implemented
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
      },
    })

    res.status(201).json({ inviteCode: inviteCode.code })
  } catch (error) {
    console.error('Error creating invite code:', error)
    res.status(500).json({ message: 'Error creating invite code' })
  }
}