// src/components/layout/MainLayout.jsx
import React from 'react';

export function MainLayout({ children }) {
  return (
    <div 
      className="min-h-screen bg-gray-50"
      data-testid="main-layout"
    >
      <header 
        className="bg-white shadow"
        data-testid="main-header"
      >
        <div 
          className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"
          data-testid="header-content"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            DataMatchHub
          </h1>
        </div>
      </header>
      <main 
        data-testid="main-content"
      >
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}