/**
 * Email format generator and validator for the DataMatchHub platform
 */

export const EMAIL_FORMATS = {
  STANDARD: 'standard', // username@department.datamatchhub.com
  SHORT: 'short'       // username.d@datamatchhub.com
}

export const generateEmailFormats = (username, department, departmentPrefix) => {
  if (!username || !department) {
    throw new Error('Username and department are required')
  }

  return {
    [EMAIL_FORMATS.STANDARD]: `${username}@${department}.datamatchhub.com`,
    [EMAIL_FORMATS.SHORT]: `${username}.${departmentPrefix || department.charAt(0)}@datamatchhub.com`
  }
}

export const validateEmail = (email, format = EMAIL_FORMATS.STANDARD) => {
  const patterns = {
    [EMAIL_FORMATS.STANDARD]: /^[a-zA-Z0/**
 * Email format generator and validator for the DataMatchHub platform
 */

export const EMAIL_FORMATS = {
  STANDARD: 'standard', // username@department.datamatchhub.com
  SHORT: 'short'       // username.d@datamatchhub.com
}

export const generateEmailFormats = (username, department, departmentPrefix) => {
  if (!username || !department) {
    throw new Error('Username and department are required')
  }

  return {
    [EMAIL_FORMATS.STANDARD]: `${username}@${department}.datamatchhub.com`,
    [EMAIL_FORMATS.SHORT]: `${username}.${departmentPrefix || department.charAt(0)}@datamatchhub.com`
  }
}

export const validateEmail = (email, format = EMAIL_FORMATS.STANDARD) => {
  const patterns = {
    [EMAIL_FORMATS.STANDARD]: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.datamatchhub\.com$/,
    [EMAIL_FORMATS.SHORT]: /^[a-zA-Z0-9._%+-]+\.[a-z]@datamatchhub\.com$/
  }

  return patterns[format].test(email)
}

export const parseEmailFormat = (email) => {
  if (email.includes('.') && email.split('@')[0].split('.').length === 2) {
    return EMAIL_FORMATS.SHORT
  }
  return EMAIL_FORMATS.STANDARD
}

export const extractUsernameFromEmail = (email) => {
  const format = parseEmailFormat(email)
  
  if (format === EMAIL_FORMATS.SHORT) {
    return email.split('@')[0].split('.')[0]
  }
  
  return email.split('@')[0]
}

export const extractDepartmentFromEmail = (email) => {
  const format = parseEmailFormat(email)
  
  if (format === EMAIL_FORMATS.SHORT) {
    return email.split('@')[0].split('.')[1]
  }
  
  return email.split('@')[1].split('.')[0]
}

export const generateEmailConfig = (department) => {
  return {
    domain: `${department}.datamatchhub.com`,
    pattern: `{username}@${department}.datamatchhub.com`,
    alternativePattern: `{username}.${department[0]}@datamatchhub.com`,
    validationRules: {
      username: {
        minLength: 3,
        maxLength: 30,
        pattern: /^[a-zA-Z0-9._-]+$/
      }
    }
  }
}

export const validateEmailConfiguration = (config) => {
  const requiredFields = ['domain', 'pattern', 'alternativePattern', 'validationRules']
  const missingFields = requiredFields.filter(field => !config[field])
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }

  return true
}

export const generateEmailAliases = (username, department) => {
  const formats = generateEmailFormats(username, department)
  return Object.values(formats)
}
