'use client';

import React from 'react';
import { ModeToggle } from './ThemeToggle';
import { Dog, UserCircle, Menu } from 'lucide-react';
import { useUserData } from '../app/providers/providers';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const userData = useUserData();

  const UserInfo = () => (
    <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <UserCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      <div className="text-sm">
        <p className="font-medium text-gray-700 dark:text-gray-200">{userData.name}</p>
        <p className="text-gray-500 dark:text-gray-400">{userData.email}</p>
      </div>
    </div>
  );

  return (
    <nav className="w-full border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4">
          {/* Logo and Title Section */}
          <div className="flex items-center w-full sm:w-auto justify-between">
            <div className="flex items-center gap-2">
              <Dog className="w-6 h-6 text-gray-900 dark:text-white" />
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Fetch Finder
                </h1>
                <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300">
                  Helping Find Your Perfect Pet Match Today!
                </p>
              </div>
            </div>
            
            {/* Mobile Actions */}
            <div className="flex items-center gap-2 sm:hidden">
              <ModeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="sm:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  {userData.name && <UserInfo />}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-4">
            {userData.name && <UserInfo />}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;