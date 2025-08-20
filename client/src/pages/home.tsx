import React, { useState, useEffect } from 'react';
import { Shield, FileText, Image, Video, Link, Search, Users, ChevronRight, Lock } from 'lucide-react';
import { Header } from '@/components/Header';
import { AuthModal } from '@/components/AuthModal';
import { QuickScanOptions } from '@/components/QuickScanOptions';
import { LearningPaths } from '@/components/LearningPaths';
import { VerificationTools } from '@/components/VerificationTools';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { authService, type User as UserType } from '@/lib/auth';

export default function Home() {
  const [activeTab, setActiveTab] = useState('content-analysis');
  const [user, setUser] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [contentType, setContentType] = useState('text');
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setUser(authService.getUser());
    }
  }, []);

  const handleAuthSuccess = () => {
    setUser(authService.getUser());
    setShowAuthModal(false);
  };

  const handleShowAuth = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onShowAuth={handleShowAuth} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section with Sign-in prompt */}
          {!user && (
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-none">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Lock className="text-white h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Unlock Advanced Features</h2>
                      <p className="text-gray-600">Sign in to save your analysis results, access premium learning modules, and utilize our full suite of verification tools.</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleShowAuth}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                    data-testid="button-signin-hero"
                  >
                    Sign In Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border">
              <TabsTrigger 
                value="content-analysis" 
                className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                data-testid="tab-content-analysis"
              >
                <span>Content Analysis</span>
              </TabsTrigger>
              <TabsTrigger 
                value="learn-mil" 
                className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                data-testid="tab-learn-mil"
              >
                <span>Learn MIL</span>
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                data-testid="tab-results"
              >
                <span>Results</span>
              </TabsTrigger>
              <TabsTrigger 
                value="verification-tools" 
                className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                data-testid="tab-verification-tools"
              >
                <span>Verification Tools</span>
              </TabsTrigger>
            </TabsList>

            {/* Content Analysis Tab */}
            <TabsContent value="content-analysis" className="space-y-8">
              {/* Content Type Selector */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <Button
                      variant={contentType === 'text' ? 'default' : 'outline'}
                      onClick={() => setContentType('text')}
                      className={`flex items-center space-x-2 ${contentType === 'text' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                      data-testid="button-content-text"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Text</span>
                    </Button>
                    <Button
                      variant={contentType === 'image' ? 'default' : 'outline'}
                      onClick={() => setContentType('image')}
                      className={`flex items-center space-x-2 ${contentType === 'image' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                      data-testid="button-content-image"
                    >
                      <Image className="h-4 w-4" />
                      <span>Image</span>
                    </Button>
                    <Button
                      variant={contentType === 'video' ? 'default' : 'outline'}
                      onClick={() => setContentType('video')}
                      className={`flex items-center space-x-2 ${contentType === 'video' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                      data-testid="button-content-video"
                    >
                      <Video className="h-4 w-4" />
                      <span>Video</span>
                    </Button>
                    <Button
                      variant={contentType === 'url' ? 'default' : 'outline'}
                      onClick={() => setContentType('url')}
                      className={`flex items-center space-x-2 ${contentType === 'url' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                      data-testid="button-content-url"
                    >
                      <Link className="h-4 w-4" />
                      <span>URL</span>
                    </Button>
                  </div>

                  {/* Content Input */}
                  {contentType === 'text' && (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Enter text to analyze..."
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="min-h-32"
                        data-testid="input-text-content"
                      />
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                        data-testid="button-analyze-content"
                      >
                        Analyze Content
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Scan Options */}
              <QuickScanOptions user={user} onAuthRequired={handleShowAuth} />
            </TabsContent>

            {/* Learn MIL Tab */}
            <TabsContent value="learn-mil" className="space-y-8">
              <LearningPaths user={user} onAuthRequired={handleShowAuth} />
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-8">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">No Analysis Results Yet</h3>
                    <p className="text-gray-600">Analyze some content to see your results here.</p>
                    <Button 
                      onClick={() => setActiveTab('content-analysis')}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      data-testid="button-start-analysis"
                    >
                      Start Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Verification Tools Tab */}
            <TabsContent value="verification-tools" className="space-y-8">
              <VerificationTools user={user} onAuthRequired={handleShowAuth} />
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex space-x-6 text-sm text-gray-600">
                <a href="#" className="hover:text-gray-900">MIL Guard</a>
                <a href="#" className="hover:text-gray-900">Resources</a>
                <a href="#" className="hover:text-gray-900">Legal</a>
              </div>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}