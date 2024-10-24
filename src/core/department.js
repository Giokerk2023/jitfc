/**
 * Core Department Management System
 * Essential functionality for dynamic department handling
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Core department store with essential functionality
export const useDepartmentStore = create(
  persist(
    (set, get) => ({
      departments: {},
      
      // Core CRUD operations
      addDepartment: (config) => {
        if (!config.id || !config.name || !config.path) {
          throw new Error('Invalid department configuration')
        }
        
        set((state) => ({
          departments: {
            ...state.departments,
            [config.id]: {
              ...config,
              emailPrefix: config.emailPrefix || config.id.charAt(0),
              createdAt: Date.now()
            }
          }
        }))
      },

      updateDepartment: (id, updates) => {
        const department = get().departments[id]
        if (!department) throw new Error('Department not found')

        set((state) => ({
          departments: {
            ...state.departments,
            [id]: {
              ...department,
              ...updates,
              updatedAt: Date.now()
            }
          }
        }))
      },

      getDepartment: (id) => get().departments[id],
      
      getAllDepartments: () => Object.values(get().departments),

      // Email format generation
      generateEmailFormat: (department, username) => {
        const dept = get().departments[department]
        if (!dept) throw new Error('Department not found')
        
        return {
          standard: `${username}@${department}.datamatchhub.com`,
          short: `${username}.${dept.emailPrefix}@datamatchhub.com`
        }
      },

      // Department validation
      validateDepartmentConfig: (config) => {
        const required = ['id', 'name', 'path']
        const missing = required.filter(field => !config[field])
        if (missing.length > 0) {
          throw new Error(`Missing required fields: ${missing.join(', ')}`)
        }
        return true
      },

      // URL generation
      getDepartmentUrl: (departmentId, username = '') => {
        const department = get().departments[departmentId]
        if (!department) throw new Error('Department not found')
        
        return username 
          ? `/${department.path}/${username}`
          : `/${department.path}`
      }
    }),
    {
      name: 'department-store',
      version: 1
    }
  )
)

// Core department configuration generator
export const DepartmentConfig = {
  create(data) {
    const defaultConfig = {
      stats: [],
      metrics: [],
      features: [],
      validations: {
        username: /^[a-zA-Z0-9_-]{3,20}$/,
        email: true
      }
    }

    return {
      id: data.id || `dept-${Date.now()}`,
      name: data.name,
      path: data.path || data.name.toLowerCase().replace(/\s+/g, '-'),
      emailPrefix: data.emailPrefix || data.name.charAt(0).toLowerCase(),
      ...defaultConfig,
      ...data
    }
  },

  extend(baseConfig, extensions) {
    return {
      ...baseConfig,
      ...extensions,
      stats: [...(baseConfig.stats || []), ...(extensions.stats || [])],
      features: [...(baseConfig.features || []), ...(extensions.features || [])],
      validations: {
        ...(baseConfig.validations || {}),
        ...(extensions.validations || {})
      }
    }
  }
}

// Core route configuration
export const RouteConfig = {
  generate(department) {
    return {
      base: `/${department.path}`,
      profile: `/${department.path}/:username`,
      settings: `/${department.path}/settings`
    }
  },

  validate(route, departments) {
    const paths = route.split('/').filter(Boolean)
    if (paths.length === 0) return false
    
    const departmentPath = paths[0]
    return departments.some(d => d.path === departmentPath)
  }
}

// Initial department templates
export const DepartmentTemplates = {
  Blogger: {
    name: 'Blogger',
    stats: ['posts', 'views', 'followers'],
    features: ['analytics', 'scheduling', 'collaboration'],
    metrics: ['engagement', 'growth', 'retention']
  },
  
  Influencer: {
    name: 'Influencer',
    stats: ['followers', 'engagement', 'reach'],
    features: ['campaigns', 'analytics', 'collaboration'],
    metrics: ['impact', 'conversion', 'growth']
  },
  
  Expert: {
    name: 'Expert',
    stats: ['contributions', 'citations', 'followers'],
    features: ['verification', 'collaboration', 'analytics'],
    metrics: ['expertise', 'influence', 'growth']
  }
}
/**
 * Utilities for handling AI-driven department management
 */

export class DepartmentAnalyzer {
  static analyzeUserData(userData) {
    const features = extractUserFeatures(userData)
    const similarities = calculateSimilarities(features)
    return {
      features,
      similarities,
      recommendedDepartment: findBestMatch(similarities)
    }
  }

  static shouldCreateNewDepartment(userData, existingDepartments) {
    const { similarities } = this.analyzeUserData(userData)
    const threshold = 0.7 // Configurable similarity threshold
    
    return !Object.values(similarities).some(score => score > threshold)
  }

  static generateDepartmentConfig(userGroup) {
    const commonFeatures = extractCommonFeatures(userGroup)
    const metrics = deriveMetrics(commonFeatures)
    
    return {
      id: generateDepartmentId(commonFeatures),
      name: generateDepartmentName(commonFeatures),
      path: generatePath(commonFeatures),
      emailPrefix: generateEmailPrefix(commonFeatures),
      stats: metrics.map(m => m.name),
      metrics: metrics,
      defaultStats: metrics.reduce((acc, m) => ({
        ...acc,
        [m.name]: m.defaultValue
      }), {}),
      validations: generateValidations(commonFeatures),
      features: commonFeatures.map(f => f.name)
    }
  }
}

function extractUserFeatures(userData) {
  return {
    profileData: extractProfileFeatures(userData),
    behavioralData: extractBehavioralFeatures(userData),
    contentData: extractContentFeatures(userData),
    interactionData: extractInteractionFeatures(userData)
  }
}

function extractProfileFeatures(userData) {
  const { bio, website, social } = userData
  return {
    hasWebsite: Boolean(website),
    hasSocialMedia: Object.keys(social || {}).length > 0,
    bioTopics: analyzeBioTopics(bio || ''),
    professionalLevel: determineProfessionalLevel(userData)
  }
}

function extractBehavioralFeatures(userData) {
  return {
    activityPattern: analyzeActivityPattern(userData.activity || []),
    interactionTypes: analyzeInteractionTypes(userData.interactions || []),
    contentPreferences: analyzeContentPreferences(userData.preferences || {})
  }
}

function extractContentFeatures(userData) {
  return {
    contentTypes: analyzeContentTypes(userData.content || []),
    topics: analyzeTopics(userData.content || []),
    style: analyzeContentStyle(userData.content || [])
  }
}

function extractInteractionFeatures(userData) {
  return {
    networkSize: calculateNetworkSize(userData.connections || []),
    engagementLevel: calculateEngagementLevel(userData.interactions || []),
    communityRole: determineCommunityRole(userData)
  }
}

function calculateSimilarities(features) {
  // Compare features with existing department profiles
  return {
    blogger: calculateBloggerSimilarity(features),
    influencer: calculateInfluencerSimilarity(features),
    expert: calculateExpertSimilarity(features)
  }
}

function findBestMatch(similarities) {
  const [bestMatch] = Object.entries(similarities)
    .sort(([, a], [, b]) => b - a)
  return bestMatch[0]
}

function extractCommonFeatures(userGroup) {
  return userGroup
    .flatMap(user => Object.values(extractUserFeatures(user)))
    .reduce((common, features) => {
      // Find features that appear in at least 70% of users
      const threshold = userGroup.length * 0.7
      return features.filter(f => 
        userGroup.filter(u => 
          hasFeature(u, f)
        ).length >= threshold
      )
    }, [])
}

function deriveMetrics(features) {
  return features.map(feature => ({
    name: generateMetricName(feature),
    type: determineMetricType(feature),
    defaultValue: calculateDefaultValue(feature),
    aggregation: determineAggregationMethod(feature)
  }))
}

function generateDepartmentId(features) {
  const base = features
    .map(f => f.name)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
  
  return `dept-${base}-${Date.now()}`
}

function generateDepartmentName(features) {
  const mainFeature = features.sort((a, b) => b.weight - a.weight)[0]
  return `${mainFeature.name.charAt(0).toUpperCase()}${mainFeature.name.slice(1)}`
}

function generatePath(features) {
  return features
    .map(f => f.name)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
}

function generateEmailPrefix(features) {
  return features
    .map(f => f.name.charAt(0))
    .join('')
    .toLowerCase()
}

function generateValidations(features) {
  return {
    username: /^[a-zA-Z0-9_-]{3,20}$/,
    email: true,
    website: features.some(f => f.requiresWebsite),
    social: features.some(f => f.requiresSocial)
  }
}

export const DepartmentValidator = {
  validateConfig(config) {
    const required = ['id', 'name', 'path', 'emailPrefix', 'stats', 'metrics']
    const missing = required.filter(field => !config[field])
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`)
    }
    
    if (!this.validateMetrics(config.metrics)) {
      throw new Error('Invalid metrics configuration')
    }
    
    return true
  },

  validateMetrics(metrics) {
    return metrics.every(metric => (
      metric.name &&
      metric.type &&
      typeof metric.defaultValue !== 'undefined' &&
      metric.aggregation
    ))
  }
}
