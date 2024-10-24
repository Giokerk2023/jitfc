import { DepartmentAnalyzer, DepartmentValidator } from '@utils/departmentUtils'

describe('DepartmentAnalyzer', () => {
  const mockUserData = {
    username: 'testuser',
    bio: 'Professional content creator',
    website: 'https://example.com',
    social: {
      twitter: 'testuser',
      instagram: 'testuser'
    },
    content: [
      { type: 'article', topic: 'marketing' },
      { type: 'video', topic: 'tutorial' }
    ]
  }

  describe('analyzeUserData', () => {
    it('extracts features from user data', () => {
      const result = DepartmentAnalyzer.analyzeUserData(mockUserData)
      expect(result).toHaveProperty('features')
      expect(result).toHaveProperty('similarities')
      expect(result).toHaveProperty('recommendedDepartment')
      
      expect(result.features).toHaveProperty('profileData')
      expect(result.features).toHaveProperty('behavioralData')
      expect(result.features).toHaveProperty('contentData')
      expect(result.features).toHaveProperty('interactionData')
    })
    
    it('identifies profile characteristics', () => {
      const { features } = DepartmentAnalyzer.analyzeUserData(mockUserData)
      
      expect(features.profileData).toEqual(expect.objectContaining({
        hasWebsite: true,
        hasSocialMedia: true
      }))
    })
  })

  describe('shouldCreateNewDepartment', () => {
    const existingDepartments = [
      { id: 'blogger', name: 'Blogger' },
      { id: 'influencer', name: 'Influencer' }
    ]

    it('recommends new department when no good match exists', () => {
      const uniqueUserData = {
        ...mockUserData,
        bio: 'Specialized technical researcher',
        content: [
          { type: 'research', topic: 'ai' },
          { type: 'paper', topic: 'machine-learning' }
        ]
      }

      const shouldCreate = DepartmentAnalyzer.shouldCreateNewDepartment(uniqueUserData, existingDepartments)
      expect(shouldCreate).toBe(true)
    })

    it('does not recommend new department when good match exists', () => {
      const bloggerData = {
        ...mockUserData,
        bio: 'Professional blogger and content creator',
        content: [
          { type: 'blog', topic: 'lifestyle' },
          { type: 'article', topic: 'travel' }
        ]
      }

      const shouldCreate = DepartmentAnalyzer.shouldCreateNewDepartment(bloggerData, existingDepartments)
      expect(shouldCreate).toBe(false)
    })
  })
})