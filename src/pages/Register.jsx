import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useDepartmentStore from '../stores/departmentStore'
import { Loader, AlertCircle, CheckCircle } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const departments = useDepartmentStore(state => state.getAllDepartments())
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    department: '',
    bio: '',
    website: '',
    social: {
      twitter: '',
      instagram: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateStep = (currentStep) => {
    setError(null)
    switch (currentStep) {
      case 1:
        if (!formData.username) return 'Username is required'
        if (!formData.email) return 'Email is required'
        if (!formData.name) return 'Name is required'
        break
      case 2:
        if (!formData.department) return 'Please select a department'
        break
      default:
        return null
    }
  }

  const handleNext = () => {
    const error = validateStep(step)
    if (error) {
      setError(error)
      return
    }
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // This would be an API call in production
      await new Promise(resolve => setTimeout(resolve, 1000))
      const department = formData.department
      navigate(`/${department}/${formData.username}`)
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`flex items-center ${i < 3 ? 'flex-1' : ''}`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${step > i ? 'bg-green-500' : step === i ? 'bg-brand-500' : 'bg-gray-200'}
                text-white font-medium
              `}>
                {step > i ? <CheckCircle className="w-5 h-5" /> : i}
              </div>
              {i < 3 && (
                <div className={`
                  flex-1 h-1 mx-2
                  ${step > i ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm">Basic Info</span>
          <span className="text-sm">Department</span>
          <span className="text-sm">Profile</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md flex items-center text-red-800">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Your Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">Select a department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Twitter Username
              </label>
              <input
                type="text"
                name="social.twitter"
                value={formData.social.twitter}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instagram Username
              </label>
              <input
                type="text"
                name="social.instagram"
                value={formData.social.instagram}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              Complete Registration
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
