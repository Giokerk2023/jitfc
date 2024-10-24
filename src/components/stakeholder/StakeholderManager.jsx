import React, { useState } from 'react';

const StakeholderManager = () => {
  // State for stakeholders
  const [stakeholders, setStakeholders] = useState([
    {
      id: 'consumers',
      title: 'Content Consumers',
      features: [
        { id: 'f1', title: 'Real-time fact verification', description: 'Verify facts while watching' },
        { id: 'f2', title: 'Enhanced accuracy', description: 'Access verified information' }
      ]
    }
  ]);

  // State for new entries
  const [newStakeholder, setNewStakeholder] = useState({ title: '' });
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });

  // CRUD Operations
  const addStakeholder = () => {
    if (!newStakeholder.title) return;
    
    const stakeholder = {
      id: newStakeholder.title.toLowerCase().replace(/\s+/g, '-'),
      title: newStakeholder.title,
      features: []
    };

    setStakeholders([...stakeholders, stakeholder]);
    setNewStakeholder({ title: '' });
  };

  const deleteStakeholder = (id) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  const addFeature = (stakeholderId) => {
    if (!newFeature.title || !newFeature.description) return;

    setStakeholders(stakeholders.map(stakeholder => {
      if (stakeholder.id === stakeholderId) {
        return {
          ...stakeholder,
          features: [...stakeholder.features, {
            id: `f-${Date.now()}`,
            ...newFeature
          }]
        };
      }
      return stakeholder;
    }));

    setNewFeature({ title: '', description: '' });
  };

  const deleteFeature = (stakeholderId, featureId) => {
    setStakeholders(stakeholders.map(stakeholder => {
      if (stakeholder.id === stakeholderId) {
        return {
          ...stakeholder,
          features: stakeholder.features.filter(f => f.id !== featureId)
        };
      }
      return stakeholder;
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Stakeholder Management</h1>

      {/* Add new stakeholder */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Stakeholder Group</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newStakeholder.title}
            onChange={(e) => setNewStakeholder({ title: e.target.value })}
            placeholder="Stakeholder Group Name"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={addStakeholder}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Group
          </button>
        </div>
      </div>

      {/* List of stakeholders */}
      <div className="space-y-6">
        {stakeholders.map(stakeholder => (
          <div key={stakeholder.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{stakeholder.title}</h3>
              <button
                onClick={() => deleteStakeholder(stakeholder.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Group
              </button>
            </div>

            {/* Features list */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="space-y-2">
                {stakeholder.features.map(feature => (
                  <li key={feature.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <div>
                      <strong>{feature.title}</strong>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                    <button
                      onClick={() => deleteFeature(stakeholder.id, feature.id)}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add feature form */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Add Feature</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Feature Title"
                  className="flex-1 p-2 border rounded"
                  value={newFeature.title}
                  onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="flex-1 p-2 border rounded"
                  value={newFeature.description}
                  onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                />
                <button
                  onClick={() => addFeature(stakeholder.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add
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