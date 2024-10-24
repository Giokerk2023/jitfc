/**
 * API handlers for email and routing functionality
 */

import { generateEmailFormats, validateEmail } from './emailUtils'
import { validateRoute, generateDynamicRoutes } from './routeUtils'

export const handleEmailGeneration = async (username, department) => {
  try {
    const emailFormats = generateEmailFormats(username, department)
    
    // Validate generated emails
    for (const format of Object.values(emailFormats)) {
      if (!validateEmail(format)) {
        throw new Error(`Invalid email format generated: ${format}`)
      }
    }
    
    return {
      success: true,
      data: emailFormats,
      message: 'Email formats generated successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to generate email formats'
    }
  }
}

export const handleRouteValidation = async (route, departments) => {
  try {
    const isValid = validateRoute(route, departments)
    
    return {
      success: true,
      data: {
        isValid,
        params: isValid ? parseRouteParams(route) : null
      },
      message: isValid ? 'Route is valid' : 'Route is invalid'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to validate route'
    }
  }
}

export const handleRoutingConfigGeneration = async (departments) => {
  try {
    const routes = generateDynamicRoutes(departments)
    
    return {
      success: true,
      data: {
        routes,
        netlifyConfig: generateNetlifyConfig(departments)
      },
      message: 'Routing configuration generated successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to generate routing configuration'
    }
  }
}

export const handleDepartmentCreation = async (departmentConfig) => {
  try {
    // Validate department configuration
    if (!departmentConfig.id || !departmentConfig.name || !departmentConfig.path) {
      throw new Error('Missing required department configuration fields')
    }

    // Generate email and routing configurations
    const emailConfig = generateEmailConfig(departmentConfig)
    const routes = generateDepartmentRoutes(departmentConfig)

    return {
      success: true,
      data: {
        department: {
          ...departmentConfig,
          emailConfig,
          routes
        }
      },
      message: 'Department created successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to create department'
    }
  }
}

export const handleUserRegistration = async (userData, department) => {
  try {
    // Generate email formats
    const emails = generateEmailFormats(userData.username, department)
    
    // Validate route
    const profileRoute = `/${department}/${userData.username}`
    if (!validateRoute(profileRoute, [{ path: department }])) {
      throw new Error('Invalid profile route generated')
    }

    return {
      success: true,
      data: {
        user: {
          ...userData,
          emails,
          profileRoute
        }
      },
      message: 'User registered successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to register user'
    }
  }
}
