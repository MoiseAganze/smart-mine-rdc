import { create } from 'zustand'

interface AppStore {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void

  activeTransportId: string | null
  setActiveTransportId: (id: string | null) => void

  notificationCount: number
  decrementNotifications: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  activeTransportId: null,
  setActiveTransportId: (id) => set({ activeTransportId: id }),

  notificationCount: 5,
  decrementNotifications: () =>
    set((s) => ({ notificationCount: Math.max(0, s.notificationCount - 1) })),
}))
