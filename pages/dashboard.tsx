import React, { useState } from 'react'

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
            onChange={(e) => setNewPunishment({...newPunishment, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={newPunishment.description}
            onChange={(e) => setNewPunishment({...newPunishment, description: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Severity (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={newPunishment.severity}
            onChange={(e) => setNewPunishment({...newPunishment, severity: parseInt(e.target.value)})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Disciplinee</label>
          <select
            value={newPunishment.disciplineeId}
            onChange={(e) => setNewPunishment({...newPunishment, disciplineeId: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a disciplinee</option>
            {disciplinees.map(disciplinee => (
              <option key={disciplinee.id} value={disciplinee.id}>{disciplinee.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Punishment
        </button>
      </form>
    </div>
  )
}

export default PunishmentsModal