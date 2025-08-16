import React, { useState } from 'react';
import { Shield, HelpCircle, Settings, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { authService, type User as UserType } from '@/lib/auth';

interface HeaderProps {
  user: UserType | null;
  onShowAuth: () => void;
}

export function Header({ user, onShowAuth }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleSignOut = () => {
    authService.logout();
    window.location.reload();
    setIsMenuOpen(false);
  };

  const handleAuthClick = () => {
    onShowAuth();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-white h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">MIL Guard</h1>
              <p className="hidden sm:block text-sm text-muted-foreground">Media & Information Literacy</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
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
                    <span className="text-sm font-medium max-w-32 truncate">
                      {user.name || user.email}
                    </span>
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
          )}
          
          {/* Mobile Navigation */}
          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col space-y-4 mt-6">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium truncate">
                          {user.name || user.email}
                        </span>
                      </div>
                      
                      <Button onClick={handleSignOut} variant="outline" className="w-full">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleAuthClick} variant="outline" className="w-full">
                      Sign In
                    </Button>
                  )}
                  
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
