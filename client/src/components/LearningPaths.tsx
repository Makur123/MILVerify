import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, CheckCircle, Lock, Play, Clock, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { type User } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';

interface LearningPathsProps {
  user: User | null;
  onAuthRequired: () => void;
}

export function LearningPaths({ user, onAuthRequired }: LearningPathsProps) {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Fetch UNESCO MIL Framework modules from API
  const { data: unescoModules, isLoading } = useQuery({
    queryKey: ['/api/learning/modules'],
    enabled: true
  });

  // Fetch user progress if authenticated
  const { data: userProgress } = useQuery({
    queryKey: ['/api/learning/progress'],
    enabled: !!user
  });

  const getProgressForModule = (moduleId: string) => {
    if (!user || !userProgress || !Array.isArray(userProgress)) return 0;
    const progress = userProgress.find((p: any) => p.moduleId === moduleId);
    return progress ? Math.round(progress.progress * 100) : 0;
  };

  const handleStartLearning = (pathId: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }
    setSelectedModule(pathId);
    toast({
      title: "Opening Learning Module",
      description: "Loading UNESCO MIL Framework content...",
    });
  };

  const handleModuleComplete = async (moduleId: string) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/learning/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          moduleId,
          progress: 1.0,
          completed: true
        })
      });

      if (response.ok) {
        toast({
          title: "Module Completed!",
          description: "Great progress on your MIL learning journey",
        });
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
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
        <div className="text-center space-y-2 mb-4 sm:mb-6">
          <p className="text-sm text-gray-600">💡 UNESCO Media & Information Literacy Framework</p>
          <Badge variant="outline" className="text-xs">Based on UNESCO MIL Competency Standards</Badge>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-gray-200">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(unescoModules && Array.isArray(unescoModules)) ? unescoModules.map((module: any) => {
              const progress = getProgressForModule(module.id);
              const isCompleted = progress >= 100;
              
              return (
                <Card key={module.id} className="relative overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
                  <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg sm:text-xl">
                          {module.id === 'mil-fundamentals' ? '📚' : 
                           module.id === 'ai-detection' ? '🎯' : '✅'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{module.hours}</span>
                        </div>
                        <div>{module.modules} modules</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{module.title}</h3>
                        {isCompleted && <Award className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <Badge variant="secondary" className="text-xs">{module.framework}</Badge>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{module.description}</p>
                    </div>

                    {/* Learning Objectives Preview */}
                    {module.content?.objectives && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Key Learning Objectives:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {module.content.objectives.slice(0, 2).map((objective: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-blue-500">•</span>
                              <span>{objective}</span>
                            </li>
                          ))}
                          {module.content.objectives.length > 2 && (
                            <li className="text-gray-500">+{module.content.objectives.length - 2} more objectives</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {user && progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => handleStartLearning(module.id)}
                      className="w-full bg-black hover:bg-gray-800 text-white text-sm"
                      data-testid={`button-start-${module.id}`}
                    >
                      {user && progress > 0 ? 'Continue Learning' : 'Start Learning'} →
                    </Button>
                  </CardContent>
                </Card>
              );
            }) : null}
          </div>
        )}
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