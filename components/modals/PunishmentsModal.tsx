import React, { useState } from 'react'
import { Disciplinee, Punishment } from '../types'

type PunishmentsModalProps = {
  disciplinees: Disciplinee[]
  onPunishmentCreated: () => void
}

const PunishmentsModal: React.FC<PunishmentsModalProps> = ({ disciplinees, onPunishmentCreated }) => {
  const [newPunishment, setNewPunishment] = useState({ name: '', description: '', severity: 1, disciplineeId: '' })

  const createPunishment = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/punishments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPunishment)
      })
      if (res.ok) {
        setNewPunishment({ name: '', description: '', severity: 1, disciplineeId: '' })
        onPunishmentCreated()
      } else {
        console.error('Failed to create punishment')
      }
    } catch (error) {
      console.error('Error creating punishment:', error)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Create Punishment</h3>
      <form onSubmit={createPunishment} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={newPunishment.name}
            onChange={(e) => setNewPunishment({...newP