import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  intensity: number;
  isEnabled: boolean;
  dueDate: string | null;
  completionDate: string | null;
  sortOrder: number;
}

type UnderwearAssignment = {
  id: string;
  date: string;
  underwear: string;
}

type ChastityAssignment = {
  id: string;
  startDate: string;
  endDate: string;
  isTimerVisible: boolean;
}

type ProgressEntry = {
  id: string;
  date: string;
  note: string;
  rating: number;
}

type Reward = {
  id: string;
  name: string;
  description: string | null;
  points: number;
  isRedeemed: boolean;
}

type Disciplinee = {
  id: string;
  name: string;
  email: string;
  tasks: Task[];
  underwearAssignments: UnderwearAssignment[];
  chastityAssignments: ChastityAssignment[];
  progressEntries: ProgressEntry[];
  rewards: Reward[];
}

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DISCIPLINER' | 'DISCIPLINEE';
  disciplinerRole: 'DAD' | 'SERGEANT' | 'JUDGE' | null;
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
  const [newTask, setNewTask] = useState({ title: '', description: '', intensity: 1, isEnabled: true, dueDate: '', disciplineeId: '', sortOrder: 0 })
  const [newUnderwearAssignment, setNewUnderwearAssignment] = useState({ date: '', underwear: '', disciplineeId: '' })
  const [newChastityAssignment, setNewChastityAssignment] = useState({ startDate: '', endDate: '', isTimerVisible: false, disciplineeId: '' })
  const [newProgressEntry, setNewProgressEntry] = useState({ note: '', rating: 5, disciplineeId: '' })
  const [newReward, setNewReward] = useState({ name: '', description: '', points: 0, disciplineeId: '' })

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
        setNewTask({ title: '', description: '', intensity: 1, isEnabled: true, dueDate: '', disciplineeId: '', sortOrder: 0 })
        fetchDisciplinees() // Refresh the list
      } else {
        console.error('Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const createUnderwearAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/underwear-assignment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUnderwearAssignment)
      })
      if (res.ok) {
        setNewUnderwearAssignment({ date: '', underwear: '', disciplineeId: '' })
        fetchDisciplinees() // Refresh the list
      } else {
        console.error('Failed to create underwear assignment')
      }
    } catch (error) {
      console.error('Error creating underwear assignment:', error)
    }
  }

  const createChastityAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/chastity-assignment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newChastityAssignment)
      })
      if (res.ok) {
        setNewChastityAssignment({ startDate: '', endDate: '', isTimerVisible: false, disciplineeId: '' })
        fetchDisciplinees() // Refresh the list
      } else {
        console.error('Failed to create chastity assignment')
      }
    } catch (error) {
      console.error('Error creating chastity assignment:', error)
    }
  }

  const createProgressEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/progress-entries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProgressEntry)
      })
      if (res.ok) {
        setNewProgressEntry({ note: '', rating: 5, disciplineeId: '' })
        fetchDisciplinees() // Refresh the list
      } else {
        console.error('Failed to create progress entry')
      }
    } catch (error) {
      console.error('Error creating progress entry:', error)
    }
  }

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
        fetchDisciplinees() // Refresh the list
      } else {
        console.error('Failed to create reward')
      }
    } catch (error) {
      console.error('Error creating reward:', error)
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
      
      {/* Task Creation Form */}
      <div className="mb-8">
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
            <label className="block mb-1">Intensity (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={newTask.intensity}
              onChange={(e) => setNewTask({...newTask, intensity: parseInt(e.target.value)})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Enabled</label>
            <input
              type="checkbox"
              checked={newTask.isEnabled}
              onChange={(e) => setNewTask({...newTask, isEnabled: e.target.checked})}
              className="mr-2"
            />
          </div>
          <div>
            <label className="block mb-1">Due Date</label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Sort Order</label>
            <input
              type="number"
              value={newTask.sortOrder}
              onChange={(e) => setNewTask({...newTask, sortOrder: parseInt(e.target.value)})}
              className="w-full p-2 border rounded"
              required
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

      {/* Underwear Assignment Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Assign Underwear</h3>
        <form onSubmit={createUnderwearAssignment} className="space-y-4">
          <div>
            <label className="block mb-1">Date</label>
            <input
              type="date"
              value={newUnderwearAssignment.date}
              onChange={(e) => setNewUnderwearAssignment({...newUnderwearAssignment, date: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Underwear</label>
            <input
              type="text"
              value={newUnderwearAssignment.underwear}
              onChange={(e) => setNewUnderwearAssignment({...newUnderwearAssignment, underwear: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Disciplinee</label>
            <select
              value={newUnderwearAssignment.disciplineeId}
              onChange={(e) => setNewUnderwearAssignment({...newUnderwearAssignment, disciplineeId: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a disciplinee</option>
              {disciplinees.map(disciplinee => (
                <option key={disciplinee.id} value={disciplinee.id}>{disciplinee.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Assign Underwear
          </button>
        </form>
      </div>

      {/* Chastity Assignment Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Assign Chastity</h3>
        <form onSubmit={createChastityAssignment} className="space-y-4">
          <div>
            <label className="block mb-1">Start Date</label>
            <input
              type="datetime-local"
              value={newChastityAssignment.startDate}
              onChange={(e) => setNewChastityAssignment({...newChastityAssignment, startDate: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">End Date</label>
            <input
              type="datetime-local"
              value={newChastityAssignment.endDate}
              onChange={(e) => setNewChastityAssignment({...newChastityAssignment, endDate: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Timer Visible</label>
            <input
              type="checkbox"
              checked={newChastityAssignment.isTimerVisible}
              onChange={(e) => setNewChastityAssignment({...newChastityAssignment, isTimerVisible: e.target.checked})}
              className="mr-2"
            />
          </div>
          <div>
            <label className="block mb-1">Disciplinee</label>
            <select
              value={newChastityAssignment.disciplineeId}
              onChange={(e) => setNewChastityAssignment({...newChastityAssignment, disciplineeId: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a disciplinee</option>
              {disciplinees.map(disciplinee => (
                <option key={disciplinee.id} value={disciplinee.id}>{disciplinee.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Assign Chastity
          </button>
        </form>
      </div>

      {/* Progress Entry Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Add Progress Entry</h3>
        <form onSubmit={createProgressEntry} className="space-y-4">
          <div>
            <label className="block mb-1">Note</label>
            <textarea
              value={newProgressEntry.note}
              onChange={(e) => setNewProgressEntry({...newProgressEntry, note: e.target.value})}
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
              value={newProgressEntry.rating}
              onChange={(e) => setNewProgressEntry({...newProgressEntry, rating: parseInt(e.target.value)})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Disciplinee</label>
            <select
              value={newProgressEntry.disciplineeId}
              onChange={(e) => setNewProgressEntry({...newProgressEntry, disciplineeId: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a disciplinee</option>
              {disciplinees.map(disciplinee => (
                <option key={disciplinee.id} value={disciplinee.id}>{disciplinee.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
            Add Progress Entry
          </button>
        </form>
      </div>

      {/* Reward Creation Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Create Reward</h3>
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
          <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Create Reward
          </button>
        </form>
      </div>

      {/* Disciplinees and Their Tasks */}
      <div>
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