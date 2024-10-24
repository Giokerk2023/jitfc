import { useState } from 'react'
import { Link } from 'react-router-dom'
import useDepartmentStore from '../stores/departmentStore'
import DepartmentCard from '../components/department/DepartmentCard'
import { Search } from 'lucide-react'

export default function Home() {
  const departments = useDepartmentStore(state => state.getAllDepartments())
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero section */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Welcome to DataMatchHub
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
          Connect with professionals across different departments and grow your network
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-brand-600 bg-brand-50 hover:bg-brand-100"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Search section */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            placeholder="Search departments..."
          />
        </div>
      </div>

      {/* Departments grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map(department => (
          <DepartmentCard
            key={department.id}
            department={department}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or check back later for new departments.
          </p>
        </div>
      )}
    </div>
  )
}
