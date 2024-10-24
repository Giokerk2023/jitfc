// src/pages/department/DepartmentHome.jsx
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatDisplay } from '@/components/department/StatDisplay';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function DepartmentHome() {
  const [loading, setLoading] = React.useState(true);
  const [departments, setDepartments] = React.useState([]);

  React.useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setDepartments([
        { id: 1, name: 'Engineering', memberCount: 45 },
        { id: 2, name: 'Marketing', memberCount: 23 },
        { id: 3, name: 'Sales', memberCount: 34 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <MainLayout>
      <div 
        className="p-4"
        data-testid="department-content"
      >
        <h1 
          className="text-2xl font-bold mb-4"
          data-testid="department-heading"
        >
          Departments
        </h1>
        <div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          data-testid="department-list"
        >
          {departments.map(dept => (
            <div 
              key={dept.id}
              data-testid={`department-item-${dept.id}`}
              className="bg-white rounded-lg shadow p-6"
            >
              <StatDisplay
                title={dept.name}
                value={dept.memberCount}
                label="Members"
              />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}