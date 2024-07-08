import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaTasks, FaUnderline, FaLock, FaChartLine, FaGift, FaExclamationTriangle, FaFlag } from 'react-icons/fa'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import DisciplineesList from '../components/DisciplineesList'
import TasksModal from '../components/modals/TasksModal'
import UnderwearModal from '../components/modals/UnderwearModal'
import ChastityModal from '../components/modals/ChastityModal'
import ProgressModal from '../components/modals/ProgressModal'
import RewardsModal from '../components/modals/RewardsModal'
import PunishmentsModal from '../components/modals/PunishmentsModal'
import GoalsModal from '../components/modals/GoalsModal'
import { User, Disciplinee } from '../types'

export default function Dashboard() {
  // ... (keep the existing code)
}

function DisciplinerDashboard({ user }: { user: User }) {
  const [disciplinees, setDisciplinees] = useState<Disciplinee[]>([])
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDisciplinees()
  }, [])

  const fetchDisciplinees = async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const dashboardItems = [
    { icon: FaTasks, label: 'Tasks', modal: 'tasks' },
    { icon: FaUnderline, label: 'Underwear', modal: 'underwear' },
    { icon: FaLock, label: 'Chastity', modal: 'chastity' },
    { icon: FaChartLine, label: 'Progress', modal: 'progress' },
    { icon: FaGift, label: 'Rewards', modal: 'rewards' },
    { icon: FaExclamationTriangle, label: 'Punishments', modal: 'punishments' },
    { icon: FaFlag, label: 'Goals', modal: 'goals' },
  ]

  if (isLoading) {
    return <div>Loading disciplinees...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Discipliner Dashboard</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {dashboardItems.map((item) => (
          <button
            key={item.modal}
            onClick={() => setActiveModal(item.modal)}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <item.icon className="text-4xl mb-2 text-blue-500" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {activeModal === 'tasks' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)}>
          <TasksModal disciplinees={disciplinees} onTaskCreated={fetchDisciplinees} />
        </Modal>
      )}

      {activeModal === 'underwear' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)}>
          <UnderwearModal disciplinees={disciplinees} onAssignmentCreated={fetchDisciplinees} />
        </Modal>
      )}

      {activeModal === 'chastity' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)}>
          <ChastityModal disciplinees={disciplinees} onAssignmentCreated={fetchDisciplinees} />
        </Modal>
      )}

      {activeModal === 'progress' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)}>
          <ProgressModal disciplinees={disciplinees} onEntryCreated={fetchDisciplinees} />
        </Modal>
      )}

      {activeModal === 'rewards' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)}>
          <RewardsModal disciplinees={disciplinees} onRewardCreated={fetchDisciplinees} />
        </Modal>
      )}

      {activeModal === 'punishments' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)}>
          <PunishmentsModal disciplinees={disciplinees} onPunishmentCreated={fetchDisciplinees} />
        </Modal>
      )}

      {activeModal === 'goals' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)}>
          <GoalsModal disciplinees={disciplinees} onGoalCreated={fetchDisciplinees} />
        </Modal>
      )}

      <DisciplineesList disciplinees={disciplinees} onTaskStatusUpdated={fetchDisciplinees} />
    </div>
  )
}

function DisciplineeDashboard({ user }: { user: User }) {
  // ... (keep the existing code)
}