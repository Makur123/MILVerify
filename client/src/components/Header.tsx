import React from 'react';
import { Shield, HelpCircle, Settings, User } from 'lucide-react';
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
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MIL Guard</h1>
              <p className="text-sm text-muted-foreground">Media & Information Literacy</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{user.name || user.email}</span>
                </div>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={onShowAuth} variant="outline" size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
