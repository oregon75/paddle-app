import React, { useState } from 'react'

type RewardsModalProps = {
  disciplinees: Disciplinee[]
  onRewardCreated: () => void
}

const RewardsModal: React.FC<RewardsModalProps> = ({ disciplinees, onRewardCreated }) => {
  const [newReward, setNewReward] = useState({ name: '', description: '', points: 0, disciplineeId: '' })

  const createReward = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReward)
      })
      if (res.ok) {
        setNewReward({ name: '', description: '', points: 0, disciplineeId: '' })
        onRewardCreated()
      } else {
        console.error('Failed to create reward')
      }
    } catch (error) {
      console.error('Error creating reward:', error)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Create Reward</h3>
      <form onSubmit={createReward} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={newReward.name}
            onChange={(e) => setNewReward({...newReward, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={newReward.description}
            onChange={(e) => setNewReward({...newReward, description: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Points</label>
          <input
            type="number"
            value={newReward.points}
            onChange={(e) => setNewReward({...newReward, points: parseInt(e.target.value)})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Disciplinee</label>
          <select
            value={newReward.disciplineeId}
            onChange={(e) => setNewReward({...newReward, disciplineeId: e.target.value})}
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
          Create Reward
        </button>
      </form>
    </div>
  )
}

export default RewardsModal