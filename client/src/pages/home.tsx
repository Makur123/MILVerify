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
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Media & Information Literacy Tool</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Detect AI-generated content, learn media literacy skills, and verify information with our comprehensive analysis tools.
            </p>
          </div>

          {/* Sign-in Banner */}
          {!user && (
            <Card className="mb-8 bg-gray-100 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4 text-center">
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Sign in to save your progress and access advanced features</span>
                  <Button 
                    onClick={handleShowAuth}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-2 text-sm"
                    data-testid="button-signin-banner"
                  >
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-200 p-1 rounded-lg">
              <TabsTrigger 
                value="content-analysis" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
                data-testid="tab-content-analysis"
              >
                Content Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="learn-mil" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
                data-testid="tab-learn-mil"
              >
                Learn MIL
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
                data-testid="tab-results"
              >
                Results
              </TabsTrigger>
              <TabsTrigger 
                value="verification-tools" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
                data-testid="tab-verification-tools"
              >
                Verification Tools
              </TabsTrigger>
            </TabsList>

            {/* Content Analysis Tab */}
            <TabsContent value="content-analysis" className="space-y-8">
              {/* Content Analysis Section */}
              <Card className="border-gray-200">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-gray-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Content Analysis</h2>
                    </div>
                    <p className="text-sm text-gray-600">
                      Upload or paste content to analyze for AI generation, deepfakes, and authenticity markers.
                      <br />
                      Sign in for advanced analysis features and history tracking.
                    </p>
                  </div>

                  {/* Content Type Selector */}
                  <div className="grid grid-cols-4 gap-4 p-1 bg-gray-100 rounded-lg">
                    <Button
                      variant={contentType === 'text' ? 'default' : 'ghost'}
                      onClick={() => setContentType('text')}
                      className={`flex items-center justify-center space-x-2 ${contentType === 'text' ? 'bg-white shadow-sm' : ''}`}
                      data-testid="button-content-text"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Text</span>
                    </Button>
                    <Button
                      variant={contentType === 'image' ? 'default' : 'ghost'}
                      onClick={() => setContentType('image')}
                      className={`flex items-center justify-center space-x-2 ${contentType === 'image' ? 'bg-white shadow-sm' : ''}`}
                      data-testid="button-content-image"
                    >
                      <Image className="h-4 w-4" />
                      <span>Image</span>
                    </Button>
                    <Button
                      variant={contentType === 'video' ? 'default' : 'ghost'}
                      onClick={() => setContentType('video')}
                      className={`flex items-center justify-center space-x-2 ${contentType === 'video' ? 'bg-white shadow-sm' : ''}`}
                      data-testid="button-content-video"
                    >
                      <Video className="h-4 w-4" />
                      <span>Video</span>
                    </Button>
                    <Button
                      variant={contentType === 'url' ? 'default' : 'ghost'}
                      onClick={() => setContentType('url')}
                      className={`flex items-center justify-center space-x-2 ${contentType === 'url' ? 'bg-white shadow-sm' : ''}`}
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
                        placeholder="Paste text content here to analyze for AI generation patterns, bias, and authenticity..."
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="min-h-40 bg-gray-50 border-gray-200"
                        data-testid="input-text-content"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{textContent.length} characters</span>
                        <Button 
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6"
                          data-testid="button-analyze-text"
                        >
                          Analyze Text
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Scan Options */}
              <QuickScanOptions user={user} onAuthRequired={handleShowAuth} />
              
              {/* Enhanced Features */}
              {!user && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <Shield className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">Enhanced Features Available!</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Sign in to access advanced analysis modes, save your results, track analysis history, and contribute to community verification efforts.
                        </p>
                        <Button 
                          onClick={handleShowAuth}
                          className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2"
                          data-testid="button-enhanced-features"
                        >
                          Sign In
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
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