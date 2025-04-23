'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ChatLink() {
  const pathname = usePathname();

  // client component; check if user is on a board, if so return to NavBar the chatbutton with the boardId
  if (pathname?.includes('/board/')) {
    const boardId = pathname.split('/').pop();
    return (
      <Link href={`/chat/${boardId}`} className="cursor-pointer mr-4">
        Chat
      </Link>
    );
  } else {
    return null;
  }
}
