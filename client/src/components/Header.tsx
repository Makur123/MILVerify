import React from 'react';
import { authService, type User as UserType } from '@/lib/auth';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  user: UserType | null;
  onShowAuth: () => void;
}

export function Header({ user, onShowAuth }: HeaderProps) {
  const handleSignOut = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900">MIL Guard</h1>
              <p className="text-xs text-gray-500 hidden sm:block">AI Detection & Media Literacy</p>
            </div>
          </div>
          
          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">🚀 Real-time Analysis</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">📚 Educational Content</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">✅ Community Verified</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Browser Extension</a>
          </nav>
          
          {/* Auth Button */}
          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onShowAuth}
              className="bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-2 rounded-md text-sm font-medium"
              data-testid="button-signin"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}