'use client';

import { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';
import { IoSend, IoRefresh } from 'react-icons/io5';
import { createClient } from '@/utils/supabase/client';
import { generateTasks, getChatResponse } from '@/utils/gpt/gptService';

export default function ChatClient({ board_id, boardName }) {
  const supabase = createClient();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const chatLogRef = useRef(null);

  useEffect(() => {
    // Add initial message
    setMessages([
      {
        text: `You are now chatting in the context of ${boardName || board_id}. How can I help with this project?`,
        sender: 'bot',
      },
    ]);

    // Scroll to bottom when messages change
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [board_id, boardName]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  const createTaskInBoard = async (task) => {
    try {
      console.log('Creating task:', task);

      const { data: columns, error: columnsError } = await supabase
        .from('columns')
        .select('id')
        .eq('board_id', board_id)
        .order('position', { ascending: true });

      if (columnsError) {
        console.error('Column fetch error:', columnsError);
        throw new Error('Failed to fetch columns');
      }

      if (!columns || columns.length === 0) {
        console.error('No columns found for board:', board_id);
        throw new Error('No columns found for this board');
      }

      const columnId = columns[0].id;
      console.log('Using column ID:', columnId);

      const { data: highestPositionCard, error: positionError } = await supabase
        .from('cards')
        .select('position')
        .eq('column_id', columnId)
        .order('position', { ascending: false })
        .limit(1);

      if (positionError) {
        console.error('Position fetch error:', positionError);
      }

      const position =
        highestPositionCard && highestPositionCard.length > 0
          ? highestPositionCard[0].position + 1
          : 0;

      console.log('Using position:', position);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('No authenticated user found');
        throw new Error('Authentication required');
      }

      const { data: newCard, error: insertError } = await supabase
        .from('cards')
        .insert({
          title: task.title,
          description: `${task.description || ''}\n\nUrgency: ${task.urgency}\nStory Points: ${task.storyPoints}`,
          column_id: columnId,
          board_id: board_id,
          position: position,
          created_by: user.id,
          status: task.status || 'Backlog',
        })
        .select();

      if (insertError) {
        console.error('Card insert error:', insertError);
        throw new Error(`Failed to create card: ${insertError.message}`);
      }

      console.log('Successfully created card:', newCard);
      return newCard;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
    setIsThinking(true);

    try {
      if (userMessage.toLowerCase().includes('generate tasks')) {
        setIsGeneratingTasks(true);

        const { data: existingCards } = await supabase
          .from('cards')
          .select('title, description')
          .eq('board_id', board_id);

        const existingTasks = existingCards
          ? existingCards.map((card) => ({
              title: card.title,
              description: card.description || '',
              status: 'Existing',
            }))
          : [];

        console.log('Existing tasks:', existingTasks);

        const generatedTasks = await generateTasks(userMessage, existingTasks);
        console.log('Generated tasks:', generatedTasks);

        let createdCount = 0;

        if (generatedTasks && generatedTasks.length > 0) {
          for (const task of generatedTasks) {
            try {
              await createTaskInBoard(task);
              createdCount++;
            } catch (taskError) {
              console.error('Failed to create task:', task.title, taskError);
            }
          }
        } else {
          console.error('No tasks were generated');
        }

        setIsGeneratingTasks(false);
        setMessages((prev) => [
          ...prev,
          {
            text: `I've generated and added ${createdCount} tasks to your board "${boardName || board_id}".`,
            sender: 'bot',
          },
        ]);
      } else {
        // for normal chat messgaes, provides context to the AI
        const contextMessage = `[Context: This message is about the project "${boardName || board_id}"] ${userMessage}`;

        const response = await getChatResponse(contextMessage);
        setMessages((prev) => [...prev, { text: response, sender: 'bot' }]);
      }
      setIsThinking(false);
    } catch (error) {
      console.error('Error in chat:', error);
      setIsThinking(false);
      setIsGeneratingTasks(false);
      setMessages((prev) => [
        ...prev,
        {
          text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
          sender: 'bot',
        },
      ]);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        text: `You are now chatting in the context of ${boardName || board_id}. How can I help with this project?`,
        sender: 'bot',
      },
    ]);
    setInput('');
    setIsGeneratingTasks(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-interface">
        <div className="chat-header">
          <h2>Chat: {boardName || `Project ${board_id.substr(0, 8)}`}</h2>
        </div>
        <div className="chat-log" ref={chatLogRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          {isThinking && (
            <div className="message bot thinking-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              board_id
                ? `Chat about ${boardName || `project ${board_id.substr(0, 8)}`}`
                : 'Chat with Flow'
            }
          />
          <div className="button-group">
            <button type="submit" className="icon-button">
              <IoSend />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={handleNewChat}
            >
              <IoRefresh />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
