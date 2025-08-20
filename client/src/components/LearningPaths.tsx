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
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Learning Paths</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {learningPaths.map((path) => {
          const IconComponent = path.icon;
          
          return (
            <Card key={path.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-br ${path.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-xs text-gray-500">
                    {path.modules} Modules • {path.hours}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{path.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{path.description}</p>
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
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  data-testid={`button-start-${path.id}`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {user && path.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!user && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Sign in to unlock the full potential of these learning resources.</h3>
                  <p className="text-sm text-gray-600">Track your progress, earn certifications, and access exclusive content.</p>
                </div>
              </div>
              <Button 
                onClick={onAuthRequired}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
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