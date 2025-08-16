import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { ContentAnalyzer } from './components/ContentAnalyzer';
import { EducationHub } from './components/EducationHub';
import { DetectionResults } from './components/DetectionResults';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AuthModal } from './components/AuthModalNew';
import { UserDashboard } from './components/UserDashboardNew';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { authHelpers } from './utils/supabase/client';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [detectionResults, setDetectionResults] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = authHelpers.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        toast.success('Successfully signed in!');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setDetectionResults(null);
        toast.info('Signed out successfully');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { session } = await authHelpers.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authHelpers.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading MIL Guard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSignOut={handleSignOut} onShowAuth={() => setShowAuthModal(true)} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4">Media & Information Literacy Tool</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Detect AI-generated content, learn media literacy skills, and verify information with our comprehensive analysis tools.
            </p>
            
            {!user && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center space-x-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Sign in to save your progress and access advanced features
                  </span>
                  <Button onClick={() => setShowAuthModal(true)} size="sm">
                    Sign In
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="analyze">Content Analysis</TabsTrigger>
              <TabsTrigger value="learn">Learn MIL</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="tools">Verification Tools</TabsTrigger>
              {user && <TabsTrigger value="dashboard">Dashboard</TabsTrigger>}
            </TabsList>

            <TabsContent value="analyze" className="space-y-6">
              <ContentAnalyzer 
                user={user}
                onAnalysisComplete={setDetectionResults}
                onTabChange={setActiveTab}
                onAuthRequired={() => setShowAuthModal(true)}
              />
            </TabsContent>

            <TabsContent value="learn" className="space-y-6">
              <EducationHub 
                user={user}
                onAuthRequired={() => setShowAuthModal(true)}
              />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <DetectionResults 
                results={detectionResults} 
                user={user}
              />
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <Navigation 
                user={user}
                onAuthRequired={() => setShowAuthModal(true)}
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