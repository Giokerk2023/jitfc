// src/pages/department/Profile.jsx
import React from 'react';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfileCard } from '@/components/department/ProfileCard';

export function Profile() {
  const [loading, setLoading] = React.useState(true);
  const [profileData, setProfileData] = React.useState(null);

  React.useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setProfileData({
        name: 'John Doe',
        department: 'Engineering',
        role: 'Senior Developer'
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <MainLayout>
      <div 
        className="p-4"
        data-testid="profile-content"
      >
        <h1 
          className="text-2xl font-bold mb-4"
          data-testid="profile-heading"
        >
          Profile
        </h1>
        <div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          data-testid="profile-grid"
        >
          <ProfileCard data={profileData} />
        </div>
      </div>
    </MainLayout>
  );
}