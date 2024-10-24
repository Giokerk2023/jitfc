import React, { useState, useEffect } from 'react';
import { stakeholderTypes, getStakeholderData, getAllStakeholders } from '../../data/stakeholders';
import { updateStakeholder } from '../../utils/stakeholderUtils';

const StakeholderTest = () => {
  const [stakeholders, setStakeholders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load all stakeholders on component mount
    setStakeholders(getAllStakeholders());
  }, []);

  const handleAddFeature = async (type) => {
    try {
      const newFeature = {
        id: `new-feature-${Date.now()}`,
        title: "Test New Feature",
        description: "This is a test feature"
      };

      const stakeholderData = getStakeholderData(type);
      stakeholderData.features.push(newFeature);

      const result = await updateStakeholder(type, stakeholderData);
      setMessage(`Updated successfully: ${result.message}`);
      
      // Refresh stakeholders
      setStakeholders(getAllStakeholders());
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Stakeholder Test Panel</h2>
      
      {message && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
          {message}
        </div>
      )}

      {stakeholders.map((stakeholder, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <h3 className="font-bold">{stakeholder.title}</h3>
          <button
            onClick={() => handleAddFeature(Object.keys(stakeholderTypes)[index])}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Test Feature
          </button>
          
          <div className="mt-2">
            <h4 className="font-semibold">Features:</h4>
            <ul className="list-disc pl-4">
              {stakeholder.features.map((feature) => (
                <li key={feature.id}>
                  {feature.title} - {feature.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StakeholderTest;