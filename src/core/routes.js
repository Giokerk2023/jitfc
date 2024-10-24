/**
 * Route utilities for dynamic department and profile routing
 */

export const ROUTE_TYPES = {
  DEPARTMENT: 'department',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  ANALYTICS: 'analytics'
}

export const generateDepartmentRoutes = (department) => {
  const { id, path } = department
  
  return {
    base: `/${path}`,
    profile: `/${path}/:username`,
    settings: `/${path}/settings`,
    analytics: `/${path}/analytics`,
    api: {
      base: `/api/${id}`,
      profiles: `/api/${id}/profiles`,
      metrics: `/api/${id}/metrics`
    }
  }
}

export const generateBreadcrumbs = (location, departments) => {
  const paths = location.pathname.split('/').filter(Boolean)
  const breadcrumbs = []
  let currentPath = ''

  paths.forEach((path, index) => {
    currentPath += `/${path}`
    
    if (index === 0) {
      // Department level
      const department = departments.find(d => d.path === path)
      if (department) {
        breadcrumbs.push({
          name: department.name,
          href: currentPath,
          current: paths.length === 1
        })
      }
    } else if (index === 1) {
      // Profile or section level
      if (path === 'settings') {
        breadcrumbs.push({
          name: 'Settings',
          href: currentPath,
          current: true
        })
      } else if (path === 'analytics') {
        breadcrumbs.push({
          name: 'Analytics',
          href: currentPath,
          current: true
        })
      } else {
        breadcrumbs.push({
          name: path, // username
          href: currentPath,
          current: true
        })
      }
    }
  })

  return breadcrumbs
}

export const validateRoute = (route, departments) => {
  const paths = route.split('/').filter(Boolean)
  
  if (paths.length === 0) return false
  
  const departmentPath = paths[0]
  const department = departments.find(d => d.path === departmentPath)
  
  if (!department) return false
  
  if (paths.length === 1) return true
  
  const subPath = paths[1]
  
  // Check if it's a valid profile route or system route
  if (subPath === 'settings' || subPath === 'analytics') return true
  
  // Validate username format for profile routes
  const usernamePattern = department.validations?.username || /^[a-zA-Z0-9_-]{3,20}$/
  return usernamePattern.test(subPath)
}

export const generateDynamicRoutes = (departments) => {
  return departments.reduce((routes, department) => {
    const departmentRoutes = generateDepartmentRoutes(department)
    return {
      ...routes,
      [department.id]: departmentRoutes
    }
  }, {})
}

export const generateRoutingConfig = (departments) => {
  const routes = generateDynamicRoutes(departments)
  
  return {
    routes,
    middleware: {
      auth: ['settings', 'analytics'],
      department: Object.keys(routes)
    },
    redirects: departments.reduce((redirects, dept) => ({
      ...redirects,
      [`/${dept.id}/*`]: {
        to: '/index.html',
        status: 200
      }
    }), {})
  }
}

export const generateNetlifyConfig = (departments) => {
  const config = generateRoutingConfig(departments)
  
  return `
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

${config.redirects.map(redirect => `
[[redirects]]
  from = "${redirect.from}"
  to = "${redirect.to}"
  status = ${redirect.status}
`).join('\n')}

[context.production]
  environment = { NODE_ENV = "production" }
`
}

export const parseRouteParams = (route) => {
  const params = {}
  const paths = route.split('/').filter(Boolean)
  
  if (paths.length >= 1) {
    params.department = paths[0]
  }
  
  if (paths.length >= 2) {
    if (['settings', 'analytics'].includes(paths[1])) {
      params.section = paths[1]
    } else {
      params.username = paths[1]
    }
  }
  
  return params
}
