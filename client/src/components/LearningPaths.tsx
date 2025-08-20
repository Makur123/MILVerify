import React from 'react';
import { BookOpen, Sparkles, CheckCircle, Lock, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { type User } from '@/lib/auth';

interface LearningPathsProps {
  user: User | null;
  onAuthRequired: () => void;
}

export function LearningPaths({ user, onAuthRequired }: LearningPathsProps) {
  const learningPaths = [
    {
      id: 'mil-fundamentals',
      title: 'MIL Fundamentals (Beginner)',
      modules: 4,
      hours: '3-4 Hours',
      description: 'Gain foundational knowledge in media literacy, understand core principles and importance in the digital age.',
      progress: user ? 25 : 0,
      color: 'from-blue-500 to-purple-600',
      icon: BookOpen
    },
    {
      id: 'ai-detection',
      title: 'AI Content Detection (Intermediate)',
      modules: 6,
      hours: '4-6 Hours',
      description: 'Explore advanced techniques for identifying AI-generated content and deepfakes using modern tools and strategies.',
      progress: user ? 60 : 0,
      color: 'from-purple-500 to-pink-600',
      icon: Sparkles
    },
    {
      id: 'fact-verification',
      title: 'Fact Verification (Advanced)',
      modules: 5,
      hours: '4-5 Hours',
      description: 'Master the art of verifying information, cross-referencing sources, and debunking misinformation effectively.',
      progress: user ? 80 : 0,
      color: 'from-green-500 to-blue-600',
      icon: CheckCircle
    }
  ];

  const handleStartLearning = (pathId: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }
    // Handle learning path start
    console.log(`Starting learning path: ${pathId}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Media & Information Literacy Hub</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
          Learn essential skills to navigate the digital information landscape and identify AI-generated content.
        </p>
      </div>

      {/* Module Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Button variant="outline" className="bg-white border-blue-300 text-blue-700 text-sm">Learning Paths</Button>
        <Button variant="outline" className="text-gray-600 text-sm">Quick Modules</Button>
        <Button variant="outline" className="text-gray-600 text-sm">Daily Tips</Button>
      </div>

      {/* Learning Paths */}
      <div className="space-y-4">
        <p className="text-center text-sm text-gray-600 mb-4 sm:mb-6">💡 Choose your learning path</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {learningPaths.map((path) => {
            const IconComponent = path.icon;
            
            return (
              <Card key={path.id} className="relative overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${path.color} rounded-lg flex items-center justify-center`}>
                      <span className="text-white text-lg sm:text-xl font-bold">
                        {path.id === 'mil-fundamentals' ? '📚' : 
                         path.id === 'ai-detection' ? '🎯' : '✅'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <div>{path.modules} modules</div>
                      <div>{path.hours}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{path.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{path.description}</p>
                  </div>

                  {user && path.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs text-gray-500">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => handleStartLearning(path.id)}
                    className="w-full bg-black hover:bg-gray-800 text-white text-sm"
                    data-testid={`button-start-${path.id}`}
                  >
                    {user && path.progress > 0 ? 'Continue Learning' : 'Start Learning'} →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Unlock Your Potential Section */}
      {!user && (
        <Card className="bg-gray-100 border-gray-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-lg flex items-center justify-center">
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">🔓 Unlock Your Full Potential!</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Sign in to track your progress, unlock advanced modules, and access personalized learning recommendations based on your skill level.
                </p>
              </div>
              <Button 
                onClick={onAuthRequired}
                className="bg-black hover:bg-gray-800 text-white px-4 sm:px-6 w-full sm:w-auto text-sm"
                data-testid="button-signin-learning"
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}