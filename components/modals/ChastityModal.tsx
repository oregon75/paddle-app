import React, { useState } from 'react'
import { ChastityAssignment, Disciplinee } from '../types'

type ChastityModalProps = {
  disciplinees: Disciplinee[]
  onAssignmentCreated: () => void
}

const ChastityModal: React.FC<ChastityModalProps> = ({ disciplinees, onAssignmentCreated }) => {
  const [newAssignment, setNewAssignment] = useState({ startDate: '', endDate: '', isTimerVisible: false, disciplineeId: '' })

  const createAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/chastity-assignment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAssignment)
      })
      if (res.ok) {
        setNewAssignment({ startDate: '', endDate: '', isTimerVisible: false, disciplineeId: '' })
        onAssignmentCreated()
      } else {
        console.error('Failed to create chastity assignment')
      }
    } catch (error) {
      console.error('Error creating chastity assignment:', error)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Assign Chastity</h3>
      <form onSubmit={createAssignment} className="space-y-4">
        <div>
          <label className="block mb-1">Start Date</label>
          <input
            type="datetime-local"
            value={newAssignment.startDate}
            onChange={(e) => setNewAssignment({...newAssignment, startDate: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">End Date</label>
          <input
            type="datetime-local"
            value={newAssignment.endDate}
            onChange={(e) => setNewAssignment({...newAssignment, endDate: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Timer Visible</label>
          <input
            type="checkbox"
            checked={newAssignment.isTimerVisible}
            onChange={(e) => setNewAssignment({...newAssignment, isTimerVisible: e.target.checked})}
            className="mr-2"
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
          Assign Chastity
        </button>
      </form>
    </div>
  )
}

export default ChastityModal