import React from 'react';

const SimpleTest = () => {
  return (
    <div style={{ 
      margin: '20px',
      padding: '20px',
      backgroundColor: 'red',  // Very distinct color
      color: 'white',
      borderRadius: '8px'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        DEBUG: Simple Test Page
      </h1>
      <div style={{
        padding: '10px',
        backgroundColor: 'blue',
        display: 'inline-block',
        borderRadius: '4px'
      }}>
        <button onClick={() => alert('DEBUG: Button clicked from SimpleTest component')}>
          DEBUG TEST BUTTON
        </button>
      </div>
    </div>
  );
};

export default SimpleTest;