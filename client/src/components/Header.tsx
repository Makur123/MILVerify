import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService, type User as UserType } from '@/lib/auth';

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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-semibold text-gray-900">logo</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Real-time Analysis</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Educational Content</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Community Verified</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Browser Extension</a>
          </nav>
          
          {/* Auth Button */}
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onShowAuth}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
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