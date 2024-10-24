import React from 'react';

const SimpleTest = () => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => alert('Button clicked!')}
      >
        Test Button
      </button>
    </div>
  );
};

export default SimpleTest;