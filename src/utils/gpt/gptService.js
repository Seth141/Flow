import { callOpenAI } from './openaiClient';

export async function generateTasks(description, existingTasks = []) {
  try {
    const response = await callOpenAI('generate-tasks', {
      description,
      existingTasks,
    });

    if (!response.tasks) {
      throw new Error('Invalid response format from API');
    }

    return response.tasks;
  } catch (error) {
    console.error('Error generating tasks:', error);
    throw error;
  }
}

export async function getChatResponse(message) {
  try {
    const response = await callOpenAI('chat', {
      message,
    });

    if (!response.reply) {
      throw new Error('Invalid response format from API');
    }

    return response.reply;
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw error;
  }
}
