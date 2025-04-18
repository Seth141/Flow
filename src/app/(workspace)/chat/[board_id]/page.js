import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ChatClient from './ChatClient';

export default async function ChatPage({ params }) {
  const { board_id } = await params;
  const supabase = await createClient();

  const { data: board, error } = await supabase
    .from('boards')
    .select('*')
    .eq('id', board_id)
    .single();

  if (error) {
    redirect('/');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || board.owner_id !== user.id) {
    redirect('/');
  }

  return (
    <ChatClient
      board_id={board_id}
      boardName={board.title || `Project ${board_id.substr(0, 8)}`}
    />
  );
}
