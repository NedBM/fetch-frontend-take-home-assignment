'use client';

import React from 'react';
import { ModeToggle } from './ThemeToggle';
import { Dog, UserCircle } from 'lucide-react';
import { useUserData } from '../app/providers/providers';

const Navbar = () => {
  const userData = useUserData();

  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center space-x-4">
                <div className="container mx-auto px-1 py-2">
                  <div className="flex items-center gap-2">
                    <Dog className="w-8 h-8 text-gray-900 dark:text-white" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Fetch Finder
                    </h1>
                  </div>
                  <div>
                    <h3 className="text-gray-600 dark:text-gray-300">
                      Helping Find Your Perfect Pet Match Today!
                    </h3>
                  </div>
                </div>
        {userData.name && (
          <div className="flex items-center space-x-2">
            <UserCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <div className="text-sm">
              <p className="font-medium text-gray-700 dark:text-gray-200">{userData.name}</p>
              <p className="text-gray-500 dark:text-gray-400">{userData.email}</p>
            </div>
          </div>
        )}
      </div>
      <ModeToggle />
    </nav>
  );
};

export default Navbar;