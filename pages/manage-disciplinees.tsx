import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function ManageDisciplinees() {
  const [disciplinees, setDisciplinees] = useState([])
  const [newTask, setNewTask] = useState({ title: '', description: '', disciplineeId: '' })
  const router = useRouter()

  useEffect(() => {
    fetchDisciplinees()
  }, [])

  const fetchDisciplinees = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch('/api/disciplinees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setDisciplinees(data)
      } else {
        console.error('Failed to fetch disciplinees')
      }
    } catch (error) {
      console.error('Error fetching disciplinees:', error)
    }
  }

  const assignDisciplinee = async (disciplineeId) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/assign-disciplinee', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ disciplineeId })
      })
      if (res.ok) {
        fetchDisciplinees() // Refresh the list
      } else {
        console.error('Failed to assign disciplinee')
      }
    } catch (error) {
      console.error('Error assigning disciplinee:', error)
    }
  }

  const createTask = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      })
      if (res.ok) {
        setNewTask({ title: '', description: '', disciplineeId: '' })
        fetchDisciplinees() // Refresh the list
      } else {
        console.error('Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Disciplinees</h1>
        {disciplinees.length === 0 ? (
          <p>No disciplinees found.</p>
        ) : (
          <ul className="space-y-4">
            {disciplinees.map((disciplinee) => (
              <li key={disciplinee.id} className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold">{disciplinee.name}</h2>
                <p className="text-gray-600">{disciplinee.email}</p>
                <button 
                  onClick={() => assignDisciplinee(disciplinee.id)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Assign to Me
                </button>
                <h3 className="text-lg font-semibold mt-4">Tasks</h3>
                <ul className="list-disc list-inside">
                  {disciplinee.tasks && disciplinee.tasks.map(task => (
                    <li key={task.id}>{task.title} - {task.status}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
        <h2 className="text-2xl font-bold mt-8 mb-4">Create New Task</h2>
        <form onSubmit={createTask} className="space-y-4">
          <div>
            <label className="block">Title</label>
            <input 
              type="text" 
              value={newTask.title} 
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block">Description</label>
            <textarea 
              value={newTask.description} 
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Disciplinee</label>
            <select 
              value={newTask.disciplineeId} 
              onChange={(e) => setNewTask({...newTask, disciplineeId: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select a disciplinee</option>
              {disciplinees.map(disciplinee => (
                <option key={disciplinee.id} value={disciplinee.id}>{disciplinee.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Create Task</button>
        </form>
      </div>
    </Layout>
  )
}