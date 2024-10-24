import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

export function MainLayout({ children }) {
  return (
    <div 
      className="min-h-screen bg-gray-50 flex flex-col"
      data-testid="main-layout"
    >
      {/* Original header preserved for backwards compatibility */}
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

      {/* New navigation header */}
      <Header />

      <main 
        className="flex-grow"
        data-testid="main-content"
      >
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* New footer component */}
      <Footer />
    </div>
  );
}

// Add default export for backwards compatibility
export default MainLayout;