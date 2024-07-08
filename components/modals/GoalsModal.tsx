import React, { useState } from 'react'

type GoalsModalProps = {
  disciplinees: Disciplinee[]
  onGoalCreated: () => void
}

const GoalsModal: React.FC<GoalsModalProps> = ({ disciplinees, onGoalCreated }) => {
  const [newGoal, setNewGoal] = useState({ name: '', description: '', targetDate: '', disciplineeId: '' })

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGoal)
      })
      if (res.ok) {
        setNewGoal({ name: '', description: '', targetDate: '', disciplineeId: '' })
        onGoalCreated()
      } else {
        console.error('Failed to create goal')
      }
    } catch (error) {
      console.error('Error creating goal:', error)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Create Goal</h3>
      <form onSubmit={createGoal} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={newGoal.name}
            onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={newGoal.description}
            onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Target Date</label>
          <input
            type="date"
            value={newGoal.targetDate}
            onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Disciplinee</label>
          <select
            value={newGoal.disciplineeId}
            onChange={(e) => setNewGoal({...newGoal, disciplineeId: e.target.value})}
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
          Create Goal
        </button>
      </form>
    </div>
  )
}

export default GoalsModal