export enum Role {
  ADMIN = 'ADMIN',
  DISCIPLINER = 'DISCIPLINER',
  DISCIPLINEE = 'DISCIPLINEE'
}

export type Task = {
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

export type UnderwearAssignment = {
  id: string;
  date: string;
  underwear: string;
}

export type ChastityAssignment = {
  id: string;
  startDate: string;
  endDate: string;
  isTimerVisible: boolean;
}

export type ProgressEntry = {
  id: string;
  date: string;
  note: string;
  rating: number;
}

export type Reward = {
  id: string;
  name: string;
  description: string | null;
  points: number;
  isRedeemed: boolean;
}

export type Punishment = {
  id: string;
  name: string;
  description: string | null;
  severity: number;
  isCompleted: boolean;
}

export type Goal = {
  id: string;
  name: string;
  description: string | null;
  targetDate: string | null;
  isAchieved: boolean;
}

export type Disciplinee = {
  id: string;
  name: string;
  email: string;
  tasks: Task[];
  underwearAssignments: UnderwearAssignment[];
  chastityAssignments: ChastityAssignment[];
  progressEntries: ProgressEntry[];
  rewards: Reward[];
  punishments: Punishment[];
  goals: Goal[];
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DISCIPLINER' | 'DISCIPLINEE';
}