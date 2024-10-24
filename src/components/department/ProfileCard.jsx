// src/components/department/ProfileCard.jsx
import React from 'react';

export function ProfileCard({ data }) {
  if (!data) return null;

  return (
    <div 
      className="bg-white rounded-lg shadow p-6"
      data-testid="profile-card"
    >
      <div 
        className="space-y-4"
        data-testid="profile-card-content"
      >
        <div className="flex items-center justify-between">
          <h2 
            className="text-xl font-semibold"
            data-testid="profile-name"
          >
            {data.name}
          </h2>
        </div>
        <div 
          className="text-gray-600"
          data-testid="profile-details"
        >
          <p data-testid="profile-department">Department: {data.department}</p>
          <p data-testid="profile-role">Role: {data.role}</p>
        </div>
      </div>
    </div>
  );
}