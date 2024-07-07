import { useState } from 'react'
import Layout from '../components/Layout'

export default function CreateInvite() {
  const [role, setRole] = useState('DISCIPLINEE')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInviteCode('')

    try {
      const res = await fetch('/api/invite/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (res.ok) {
        const data = await res.json()
        setInviteCode(data.inviteCode)
      } else {
        const data = await res.json()
        setError(data.message)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
          <h3 className="text-2xl font-bold text-center">Create Invite Code</h3>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <div>
                <label className="block" htmlFor="role">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="DISCIPLINER">Discipliner</option>
                  <option value="DISCIPLINEE">Disciplinee</option>
                </select>
              </div>
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Generate Invite Code
              </button>
            </div>
          </form>
          {inviteCode && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Invite Code: {inviteCode}
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}