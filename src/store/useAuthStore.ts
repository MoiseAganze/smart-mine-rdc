import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  matricule: string
  name: string
  role: 'admin' | 'superviseur' | 'agent'
  province: string
  email: string
}

interface AuthState {
  user: AuthUser | null
  login: (matricule: string, password: string) => boolean
  logout: () => void
}

const USERS: Array<AuthUser & { password: string }> = [
  {
    matricule: 'ADM-2024-001',
    password:  'SmartMine@2024',
    name:      'Sophie Tshisekedi',
    role:      'admin',
    province:  'Kinshasa',
    email:     's.tshisekedi@mines.gouv.cd',
  },
  {
    matricule: 'AGT-2024-042',
    password:  'Agent@1234',
    name:      'Marie-Claire Kabongo',
    role:      'agent',
    province:  'Haut-Katanga',
    email:     'm.kabongo@mines.gouv.cd',
  },
  {
    matricule: 'SUP-2024-007',
    password:  'Superviseur@99',
    name:      'Christophe Ilunga',
    role:      'superviseur',
    province:  'Lualaba',
    email:     'c.ilunga@mines.gouv.cd',
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (matricule, password) => {
        const found = USERS.find(
          u => u.matricule === matricule.trim() && u.password === password
        )
        if (found) {
          const { password: _pw, ...user } = found
          set({ user })
          return true
        }
        return false
      },
      logout: () => set({ user: null }),
    }),
    { name: 'smart-mine-auth' }
  )
)
