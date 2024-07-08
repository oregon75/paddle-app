import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      // Fetch user data
      fetchUserData(token)
    }
  }, [])

  const fetchUserData = async (token) => {
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
        // If token is invalid, redirect to login
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

function DisciplinerDashboard({ user }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Discipliner Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Manage Disciplinees" link="/manage-disciplinees">
          View and manage your disciplinees
        </DashboardCard>
        <DashboardCard title="Create Invite Code" link="/create-invite">
          Generate invite codes for new disciplinees
        </DashboardCard>
      </div>
    </div>
  )
}

function DisciplineeDashboard({ user }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Disciplinee Dashboard</h2>
      {/* Add disciplinee-specific content here */}
    </div>
  )
}

function DashboardCard({ title, children, link }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{children}</p>
      <a href={link} className="text-blue-600 hover:underline">Go to {title}</a>
    </div>
  )
}