import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { produce } from 'immer'

// Adding initial departments while preserving existing ones
const initialDepartments = {
  blogger: {
    id: 'blogger',
    name: 'Blogger',
    path: 'blogger',
    emailPrefix: 'b',
    features: ['content', 'analytics', 'collaboration'],
    defaultStats: {
      posts: 0,
      views: 0,
      followers: 0
    }
  },
  influencer: {
    id: 'influencer',
    name: 'Influencer',
    path: 'influencer',
    emailPrefix: 'i',
    features: ['engagement', 'campaigns', 'analytics'],
    defaultStats: {
      followers: 0,
      engagement: 0,
      reach: 0
    }
  }
};

const useDepartmentStore = create(
  persist(
    (set, get) => ({
      // Preserved existing state
      departments: initialDepartments,
      isLoading: false,
      error: null,
      
      // Preserved existing methods
      initializeDepartments: async () => {
        set({ isLoading: true, error: null })
        try {
          // Your existing initialization logic
          set({ isLoading: false })
        } catch (error) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      addDepartment: (config) => {
        if (!config.id) throw new Error('Department ID is required')
        
        return set(
          produce((state) => {
            state.departments[config.id] = {
              ...config,
              path: config.path || config.id,
              emailPrefix: config.emailPrefix || config.id[0],
              defaultStats: config.defaultStats || {},
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          })
        )
      },
      
      updateDepartment: (id, updates) => {
        const department = get().departments[id]
        if (!department) throw new Error('Department not found')

        return set(
          produce((state) => {
            state.departments[id] = {
              ...department,
              ...updates,
              updatedAt: new Date().toISOString(),
              _changeHistory: [
                ...(department._changeHistory || []),
                {
                  timestamp: new Date().toISOString(),
                  changes: updates
                }
              ]
            }
          })
        )
      },
      
      removeDepartment: (id) => {
        const department = get().departments[id]
        if (!department) throw new Error('Department not found')

        return set(
          produce((state) => {
            state._archivedDepartments = {
              ...(state._archivedDepartments || {}),
              [id]: {
                ...department,
                archivedAt: new Date().toISOString()
              }
            }
            delete state.departments[id]
          })
        )
      },

      getDepartment: (id) => get().departments[id],
      getAllDepartments: () => Object.values(get().departments),
      getDepartmentPaths: () => Object.values(get().departments).map(dept => dept.path),
      
      generateEmailFormat: (department, username) => {
        const dept = get().departments[department]
        if (!dept) throw new Error('Department not found')
        if (!username?.match(/^[a-zA-Z0-9_-]{3,20}$/)) {
          throw new Error('Invalid username format')
        }
        
        return {
          standard: `${username}@${department}.datamatchhub.com`,
          short: `${username}.${dept.emailPrefix}@datamatchhub.com`,
          internal: `${username}@internal.datamatchhub.com`
        }
      },

      // Preserved additional features
      getDepartmentStats: (id) => {
        const dept = get().departments[id]
        if (!dept) throw new Error('Department not found')
        
        return {
          ...dept.stats,
          memberCount: 0, // Actual counting logic would go here
          activeMembers: 0,
          lastActive: new Date().toISOString()
        }
      },
      
      searchDepartments: (query) => {
        const departments = get().departments
        return Object.values(departments).filter(dept => 
          dept.name.toLowerCase().includes(query.toLowerCase()) ||
          dept.features.some(f => f.toLowerCase().includes(query.toLowerCase()))
        )
      }
    }),
    {
      name: 'department-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migration logic if needed
          return persistedState
        }
        return persistedState
      }
    }
  )
)

export default useDepartmentStore