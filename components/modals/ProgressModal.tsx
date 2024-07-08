import React, { useState } from 'react'
import { Disciplinee, ProgressEntry } from '../types'

type ProgressModalProps = {
  disciplinees: Disciplinee[]
  onEntryCreated: () => void
}

const ProgressModal: React.FC<ProgressModalProps> = ({ disciplinees, onEntryCreated }) => {
  const [newEntry, setNewEntry] = useState({ note: '', rating: 5, disciplineeId: '' })

  const createEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/progress-entries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEntry)
      })
      if (res.ok) {
        setNewEntry({ note: '', rating: 5, disciplineeId: '' })
        onEntryCreated()
      } else {
        console.error('Failed to create progress entry')
      }
    } catch (error) {
      console.error('Error creating progress entry:', error)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Add Progress Entry</h3>
      <form onSubmit={createEntry} className="space-y-4">
        <div>
          <label className="block mb-1">Note</label>
          <textarea
            value={newEntry.note}
            onChange={(e) => setNewEntry({...newEntry, note: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Rating (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={newEntry.rating}
            onChange={(e) => setNewEntry({...newEntry, rating: parseInt(e.target.value)})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Disciplinee</label>
          <select
            value={newEntry.disciplineeId}
            onChange={(e) => setNewEntry({...newEntry, disciplineeId: e.target.value})}
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
          Add Progress Entry
        </button>
      </form>
    </div>
  )
}

export default ProgressModal