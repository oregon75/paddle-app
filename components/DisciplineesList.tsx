import React from 'react'
import { Disciplinee, Task } from '../types'

type DisciplineesListProps = {
  disciplinees: Disciplinee[]
  onTaskStatusUpdated: () => void
}

const DisciplineesList: React.FC<DisciplineesListProps> = ({ disciplinees, onTaskStatusUpdated }) => {
  const updateTaskStatus = async (taskId: string, newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        onTaskStatusUpdated()
      } else {
        console.error('Failed to update task status')
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Your Disciplinees</h3>
      {disciplinees.length === 0 ? (
        <p>No disciplinees assigned yet.</p>
      ) : (
        <div className="space-y-4">
          {disciplinees.map((disciplinee) => (
            <div key={disciplinee.id} className="bg-white shadow-md rounded-lg p-4">
              <h4 className="text-lg font-semibold">{disciplinee.name}</h4>
              <p className="text-gray-600">{disciplinee.email}</p>
              <h5 className="text-md font-semibold mt-2">Tasks:</h5>
              <ul className="list-disc list-inside">
                {disciplinee.tasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between">
                    <span>{task.title} - Intensity: {task.intensity} - {task.status}</span>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED')}
                      className="ml-2 p-1 border rounded"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DisciplineesList