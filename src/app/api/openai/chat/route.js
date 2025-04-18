import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
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
