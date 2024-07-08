import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

type Disciplinee = {
  id: string;
  name: string;
  email: string;
  tasks: Task[];
}

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DISCIPLINER' | 'DISCIPLINEE';
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      fetchUserData(token)
    }
  }, [])

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
        {user.role === 'DISCIPLINER' && <DisciplinerDashboard user={user} />}
        {user.role === 'DISCIPLINEE' && <DisciplineeDashboard user={user} />}
      </div>
    </Layout>
  )
}

function DisciplinerDashboard({ user }: { user: User }) {
  const [disciplinees, setDisciplinees] = useState<Disciplinee[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '', disciplineeId: '' })

  useEffect(() => {
    fetchDisciplinees()
  }, [])

  const fetchDisciplinees = async () => {
    const token = localStorage.getItem('token')
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

  const createTask = async (e: React.FormEvent) => {
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
        fetchDisciplinees() // Refresh the list
      } else {
        console.error('Failed to update task status')
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Discipliner Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Your Disciplinees</h3>
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
                      <span>{task.title} - {task.status}</span>
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
      <div>
        <h3 className="text-xl font-semibold mb-2">Create New Task</h3>
        <form onSubmit={createTask} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Disciplinee</label>
            <select
              value={newTask.disciplineeId}
              onChange={(e) => setNewTask({...newTask, disciplineeId: e.target.value})}
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
            Create Task
          </button>
        </form>
      </div>
    </div>
  )
}

function DisciplineeDashboard({ user }: { user: User }) {
  // We'll implement this later
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Disciplinee Dashboard</h2>
      <p>Welcome, {user.name}. Your dashboard is coming soon!</p>
    </div>
  )
}