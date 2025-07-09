'use client';

import Link from 'next/link';
import { CreditCard } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

export default function SidebarNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data?.user);
    });
  }, []);

  return (
    <div className="mb-6">
      <nav>
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100/20 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href={isLoggedIn ? "/payments" : "/pricing"}
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100/20 transition-colors"
            >
              <CreditCard className="w-4 h-4 mr-3" />
              {isLoggedIn ? "Billing & Plans" : "Pricing"}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
