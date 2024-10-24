// src/components/common/LoadingSpinner.jsx
import React from 'react';

export function LoadingSpinner() {
  return (
    <div 
      className="flex justify-center items-center"
      data-testid="loading-spinner-container"
    >
      <div 
        className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
        data-testid="loading-spinner"
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div 
      className="min-h-screen flex justify-center items-center"
      data-testid="page-loader"
    >
      <LoadingSpinner />
    </div>
  );
}