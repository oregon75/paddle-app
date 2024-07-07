import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcrypt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, password, inviteCode } = req.body

  try {
    // Check if the invite code is valid
    const invite = await prisma.inviteCode.findUnique({
      where: { code: inviteCode },
    })

    if (!invite || invite.usedById) {
      return res.status(400).json({ message: 'Invalid or already used invite code' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: invite.role,
      },
    })

    // Mark the invite code as used
    await prisma.inviteCode.update({
      where: { id: invite.id },
      data: { usedById: user.id },
    })

    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Error creating user' })
  }
}