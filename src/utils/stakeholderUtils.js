import { stakeholderTypes, initialStakeholders } from '../data/stakeholders';

export const updateStakeholder = async (type, newData) => {
  try {
    const response = await fetch('/.netlify/functions/updateStakeholder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        stakeholderData: newData
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update stakeholder');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating stakeholder:', error);
    throw error;
  }
};

export const validateStakeholderData = (data) => {
  const required = ['title', 'features'];
  const missingFields = required.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (!Array.isArray(data.features)) {
    throw new Error('Features must be an array');
  }

  return true;
};