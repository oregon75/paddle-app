// components/TasksModal.tsx
import React, { useState } from 'react'
import { Disciplinee, Task } from '../types'

type TasksModalProps = {
  disciplinees: Disciplinee[]
  onTaskCreated: () => void
}

const TasksModal: React.FC<TasksModalProps> = ({ disciplinees, onTaskCreated }) => {
  const [newTask, setNewTask] = useState({ title: '', description: '', intensity: 1, isEnabled: true, dueDate: '', disciplineeId: '', sortOrder: 0 })

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    // ... (keep the existing createTask function)
    onTaskCreated()
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Create New Task</h3>
      <form onSubmit={createTask} className="space-y-4">
        {/* ... (keep the existing form fields) */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Task
        </button>
      </form>
    </div>
  )
}

export default TasksModal