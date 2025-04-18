// This file provides client-side wrappers for server-side OpenAI API calls

export async function callOpenAI(endpoint, data) {
  try {
    const response = await fetch(`/api/openai/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling OpenAI ${endpoint} endpoint:`, error);
    throw error;
  }
}
