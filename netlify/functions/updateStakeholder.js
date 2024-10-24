// Netlify serverless function to update stakeholder data
export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { type, stakeholderData } = data;

    // Validate the incoming data
    if (!type || !stakeholderData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }

    // Here you would typically:
    // 1. Validate the data more thoroughly
    // 2. Save to a database or storage
    // 3. Trigger a rebuild if necessary

    // For now, we'll just return success
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Stakeholder updated successfully',
        type,
        stakeholderData
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating stakeholder', error: error.message })
    };
  }
}