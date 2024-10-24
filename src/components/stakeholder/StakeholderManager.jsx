import React, { useState, useEffect } from 'react';
import { stakeholderTypes, getStakeholderData, getAllStakeholders } from '../../data/stakeholders';

const StakeholderManager = () => {
  const [stakeholders, setStakeholders] = useState([]);
  const [newStakeholder, setNewStakeholder] = useState({
    title: '',
    features: [],
    enabled: true
  });
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    setStakeholders(getAllStakeholders());
  }, []);

  const handleAddStakeholder = () => {
    if (!newStakeholder.title) return;

    const stakeholderId = newStakeholder.title.toLowerCase().replace(/\s+/g, '-');
    const updatedStakeholder = {
      ...newStakeholder,
      id: stakeholderId,
      features: [],
      enabled: true
    };

    // Here we would typically make an API call to save the new stakeholder
    console.log('New stakeholder to be added:', updatedStakeholder);

    setNewStakeholder({
      title: '',
      features: [],
      enabled: true
    });
  };

  const handleAddFeature = (stakeholderId) => {
    if (!newFeature.title || !newFeature.description) return;

    const featureId = `${stakeholderId}-${Date.now()}`;
    const feature = {
      ...newFeature,
      id: featureId
    };

    // Here we would typically make an API call to save the new feature
    console.log('New feature to be added:', feature);

    setNewFeature({
      title: '',
      description: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Stakeholder Manager</h2>
      
      {/* Add New Stakeholder Form */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">Add New Stakeholder Group</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={newStakeholder.title}
            onChange={(e) => setNewStakeholder({ ...newStakeholder, title: e.target.value })}
            placeholder="Stakeholder Group Name"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAddStakeholder}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Group
          </button>
        </div>
      </div>

      {/* Existing Stakeholders */}
      <div className="space-y-6">
        {stakeholders.map((stakeholder, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">{stakeholder.title}</h3>
            
            {/* Features List */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="list-disc pl-6">
                {stakeholder.features.map((feature) => (
                  <li key={feature.id}>
                    <strong>{feature.title}</strong> - {feature.description}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add Feature Form */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Feature Title"
                  className="flex-1 p-2 border rounded"
                  value={newFeature.title}
                  onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Feature Description"
                  className="flex-1 p-2 border rounded"
                  value={newFeature.description}
                  onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                />
                <button
                  onClick={() => handleAddFeature(stakeholder.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Feature
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StakeholderManager;