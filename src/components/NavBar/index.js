'use client';

import flowLogo from '@/assets/images/flow-logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { logout } from '@/actions/authentication';
import ChatLink from './ChatLink';
import { CreditCard, Home } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

export default function NavBar({ className = '' }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data?.user);
    });
  }, []);

  return (
    <nav
      className={`flex justify-between p-2 sticky top-0 z-10 w-full ${className} h-[48px] border-b bg-theme-bg-main/80 backdrop-blur-sm`}
    >
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center cursor-pointer">
          <Image src={flowLogo} alt="Flow Logo" width={30} height={30} />
          <div className="ml-2 font-semibold">Flow</div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-1">
          <Link
            href="/"
            className="flex items-center px-3 py-2 rounded-lg hover:bg-theme-bg-secondary transition-colors text-sm font-medium"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
          <Link
            href={isLoggedIn ? "/payments" : "/pricing"}
            className="flex items-center px-3 py-2 rounded-lg hover:bg-theme-bg-secondary transition-colors text-sm font-medium"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isLoggedIn ? "Billing & Plans" : "Pricing"}
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <ChatLink />
        
        <div className="flex items-center bg-black/20 rounded-lg">
          <form action={logout} className="p-2">
            <button type="submit" className="text-sm font-medium hover:text-theme-accent transition-colors">
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
