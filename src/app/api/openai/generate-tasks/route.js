import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Check if OpenAI is properly configured
const isOpenAIConfigured = process.env.NEXT_PUBLIC_OPENAI_API_KEY && process.env.NEXT_PUBLIC_OPENAI_API_KEY !== 'your_openai_api_key_here';
const openai = isOpenAIConfigured ? new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
}) : null;

export async function POST(request) {
  try {
    // If OpenAI is not configured, return a placeholder response
    if (!isOpenAIConfigured) {
      console.warn('OpenAI is not configured. Please set NEXT_PUBLIC_OPENAI_API_KEY in your environment variables.');
      return NextResponse.json(
        { 
          error: 'AI task generation is not configured. Please contact support.',
          tasks: [
            {
              id: 'placeholder-1',
              title: 'Configure AI Integration',
              description: 'Set up OpenAI API key to enable AI-powered task generation',
              status: 'Backlog',
              urgency: 'medium',
              storyPoints: '2'
            },
            {
              id: 'placeholder-2', 
              title: 'Review Project Requirements',
              description: 'Analyze project scope and define key deliverables',
              status: 'Backlog',
              urgency: 'high',
              storyPoints: '3'
            }
          ]
        },
        { status: 503 }
      );
    }

    const { description, existingTasks = [] } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    let systemMessage = `You are a project management assistant. Generate tasks with varying levels of urgency and complexity.
                    IMPORTANT: Each task MUST include both urgency and story points in json format.

                    For each task you MUST:
                    1. Set urgency to exactly one of: "high", "medium", or "low"
                    2. Set storyPoints to exactly one of: "1", "2", "3", "4", or "5"

                    Example response format:
                    {
                        "tasks": [
                        {
                            "title": "Set up database",
                            "description": "Configure and initialize the PostgreSQL database",
                            "urgency": "high",
                            "status": "open",
                            "storyPoints": "4"
                        }
                        ]
                    }

                    Make sure each task has different urgency levels and story points based on:
                    - Urgency: task importance and time-sensitivity
                    - Story Points: task complexity and effort required

                    DO NOT use the same urgency or story points for all tasks.`;

    if (existingTasks && existingTasks.length > 0) {
      systemMessage += `\n\nThe project already has the following tasks. Please generate new complementary tasks that don't duplicate these existing ones:\n`;
      existingTasks.forEach((task, index) => {
        systemMessage += `${index + 1}. ${task.title}${task.status ? ` (${task.status})` : ''}: ${task.description || 'No description'}\n`;
      });
      systemMessage += `\nPlease create new tasks that complement these existing ones and cover aspects of the project that aren't addressed yet.`;
    }

    console.log('Calling OpenAI API with model: gpt-4o');
    try {
      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: description,
          },
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' },
      });

      try {
        console.log('Processing OpenAI response');
        const response = JSON.parse(chatCompletion.choices[0].message.content);
        if (!response.tasks || !Array.isArray(response.tasks)) {
          throw new Error('Invalid response format');
        }

        const tasks = response.tasks.map((task) => {
          if (!task.urgency || !task.storyPoints) {
            throw new Error('Missing urgency or story points');
          }
          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: task.title,
            description: task.description,
            status: task.status || 'Backlog',
            urgency: task.urgency,
            storyPoints: task.storyPoints,
          };
        });

        return NextResponse.json({ tasks });
      } catch (parseError) {
        console.error('Error parsing GPT-4 response:', parseError);
        return NextResponse.json(
          { error: 'Failed to generate valid tasks' },
          { status: 500 }
        );
      }
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      return NextResponse.json(
        { error: `OpenAI API Error: ${openaiError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in generate-tasks API route:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
