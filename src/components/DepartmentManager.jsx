import React from 'react';

const DepartmentManager = ({ departments = [], onDepartmentUpdate }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Department Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div 
            key={dept.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg">{dept.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{dept.path}</p>
            {dept.emailPrefix && (
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {dept.emailPrefix}
                </span>
              </div>
            )}
          </div>
        ))}
        
        {departments.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No departments available
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentManager;