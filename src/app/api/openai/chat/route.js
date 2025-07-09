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
          error: 'AI chat is not configured. Please contact support.',
          reply: 'I apologize, but AI chat functionality is not currently available. Please contact support to enable this feature.'
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    console.log('Chat request received:', body);

    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('Calling OpenAI API with model: gpt-4');
    try {
      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a software engineering assistant named Ebb. Your goal is to provide detailed answers with well-written code examples when appropriate. Analyze user questions carefully and ask follow-up questions when necessary.',
          },
          { role: 'user', content: message },
        ],
      });

      console.log('OpenAI API response received');
      const reply = chatCompletion.choices[0].message.content;

      return NextResponse.json({ reply });
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      return NextResponse.json(
        { error: `OpenAI API Error: ${openaiError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
