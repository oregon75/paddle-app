import React, { useState } from 'react'
import { Disciplinee, UnderwearAssignment } from '../../types'

type UnderwearModalProps = {
  disciplinees: Disciplinee[]
  onAssignmentCreated: () => void
}

const UnderwearModal: React.FC<UnderwearModalProps> = ({ disciplinees, onAssignmentCreated }) => {
  const [newAssignment, setNewAssignment] = useState({ date: '', underwear: '', disciplineeId: '' })

  const createAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/underwear-assignment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAssignment)
      })
      if (res.ok) {
        setNewAssignment({ date: '', underwear: '', disciplineeId: '' })
        onAssignmentCreated()
      } else {
        console.error('Failed to create underwear assignment')
      }
    } catch (error) {
      console.error('Error creating underwear assignment:', error)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Assign Underwear</h3>
      <form onSubmit={createAssignment} className="space-y-4">
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            value={newAssignment.date}
            onChange={(e) => setNewAssignment({...newAssignment, date: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Underwear</label>
          <input
            type="text"
            value={newAssignment.underwear}
            onChange={(e) => setNewAssignment({...newAssignment, underwear: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Disciplinee</label>
          <select
            value={newAssignment.disciplineeId}
            onChange={(e) => setNewAssignment({...newAssignment, disciplineeId: e.target.value})}
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
          Assign Underwear
        </button>
      </form>
    </div>
  )
}

export default UnderwearModal