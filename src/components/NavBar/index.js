import flowLogo from '@/assets/images/flow-logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { logout } from '@/actions/authentication';
import ChatLink from './ChatLink';

export default function NavBar({ className = '' }) {
  return (
    <nav
      className={`flex justify-between p-2 sticky top-0 z-10 w-full ${className} h-[48px] border-b`}
    >
      <Link href="/" className="mr-4 flex items-center cursor-pointer">
        <Image src={flowLogo} alt="Flow Logo" width={30} height={30} />
        <div>Flow</div>
      </Link>

      <nav className="flex items-center cursor-pointer mr-4">
        <ChatLink />
      </nav>

      <div className="flex items-center bg-black/20">
        <form action={logout} className="p-2">
          <button type="submit">Logout</button>
        </form>
      </div>
    </nav>
  );
}
