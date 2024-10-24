import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatDisplay({ label, value, previousValue, format = 'number' }) {
  const formatValue = (val) => {
    if (format === 'number') {
      return parseInt(val).toLocaleString()
    }
    if (format === 'percentage') {
      return `${val}%`
    }
    return val
  }

  const calculateChange = () => {
    if (!previousValue) return null
    const change = ((value - previousValue) / previousValue) * 100
    return {
      value: Math.abs(change).toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    }
  }

  const change = calculateChange()

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900">
        {formatValue(value)}
      </dd>
      {change && (
        <div className="mt-2 flex items-center text-sm">
          {change.direction === 'up' && (
            <>
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">
                {change.value}%
              </span>
            </>
          )}
          {change.direction === 'down' && (
            <>
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-red-600">
                {change.value}%
              </span>
            </>
          )}
          {change.direction === 'neutral' && (
            <>
              <Minus className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-gray-600">
                No change
              </span>
            </>
          )}
          <span className="ml-2 text-gray-500">from previous period</span>
        </div>
      )}
    </div>
  )
}
