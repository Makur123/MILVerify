import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { ContentAnalyzer } from '@/components/ContentAnalyzer';
import { EducationHub } from '@/components/EducationHub';
import { DetectionResults } from '@/components/DetectionResults';
import { VerificationTools } from '@/components/VerificationTools';
import { UserDashboard } from '@/components/UserDashboard';
import { Header } from '@/components/Header';
import { AuthModal } from '@/components/AuthModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { authService, type User as UserType } from '@/lib/auth';

export default function Home() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [detectionResults, setDetectionResults] = useState(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check for existing authentication
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
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Introduction Section */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Detect AI Content & Learn Media Literacy
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Analyze content for AI generation, learn critical thinking skills, and verify information with our comprehensive suite of tools.
            </p>
            
            {/* Guest User Notice */}
            {!user && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-4">
                  <User className="text-blue-600 h-5 w-5" />
                  <span className="text-sm text-blue-800">
                    Sign in to save your progress and access advanced features
                  </span>
                  <Button onClick={handleShowAuth} size="sm">
                    Sign In
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-gray-100 p-1">
              <TabsTrigger value="analyze" className="flex items-center space-x-2">
                <span>Content Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="learn" className="flex items-center space-x-2">
                <span>Learn MIL</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center space-x-2">
                <span>Results</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center space-x-2">
                <span>Verification Tools</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center space-x-2" disabled={!user}>
                <span>Dashboard</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="space-y-6">
              <ContentAnalyzer 
                user={user}
                onAnalysisComplete={setDetectionResults}
                onAuthRequired={handleShowAuth}
              />
            </TabsContent>

            <TabsContent value="learn" className="space-y-6">
              <EducationHub 
                user={user}
                onAuthRequired={handleShowAuth}
              />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <DetectionResults 
                results={detectionResults} 
                user={user}
              />
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <VerificationTools 
                user={user}
                onAuthRequired={handleShowAuth}
              />
            </TabsContent>

            {user && (
              <TabsContent value="dashboard" className="space-y-6">
                <UserDashboard user={user} />
              </TabsContent>
            )}
          </Tabs>
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
