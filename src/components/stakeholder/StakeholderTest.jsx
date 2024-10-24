import React from "react";

const StakeholderTest = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Stakeholder Test Page</h2>
      <div className="bg-blue-100 p-4 rounded">
        <p>Simple test component to verify routing</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => alert("Test component working!")}
        >
          Test Button
        </button>
      </div>
    </div>
  );
};

export default StakeholderTest;