import React, { useState, useEffect } from 'react';
import { GraduationCap, Play, ArrowRight, ArrowLeft, Lock, CheckCircle, Book, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { apiCall } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/auth';

interface EducationHubProps {
  user: User | null;
  onAuthRequired: () => void;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  content: any;
  order: number;
  isActive: boolean;
}

interface UserProgress {
  id: string;
  moduleId: string;
  completed: boolean;
  progress: number;
}

export function EducationHub({ user, onAuthRequired }: EducationHubProps) {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [currentModule, setCurrentModule] = useState<LearningModule | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadModules();
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadModules = async () => {
    try {
      const response = await apiCall('/learning/modules');
      const data = await response.json();
      setModules(data);
      if (data.length > 0 && !currentModule) {
        setCurrentModule(data[1]); // Start with second module (deepfake detection)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load learning modules",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;
    
    try {
      const response = await apiCall('/learning/progress');
      const data = await response.json();
      setUserProgress(data);
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  };

  const updateProgress = async (moduleId: string, progress: number, completed: boolean = false) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    try {
      const response = await apiCall('/learning/progress', {
        method: 'POST',
        body: JSON.stringify({ moduleId, progress, completed }),
      });
      
      await loadUserProgress();
      
      if (completed) {
        toast({
          title: "Module Completed!",
          description: "Great job! You've completed this learning module.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update progress",
      });
    }
  };

  const getModuleProgress = (moduleId: string) => {
    return userProgress.find(p => p.moduleId === moduleId);
  };

  const getOverallProgress = () => {
    if (modules.length === 0) return 0;
    const completedModules = userProgress.filter(p => p.completed).length;
    return Math.round((completedModules / modules.length) * 100);
  };

  const isModuleUnlocked = (moduleOrder: number) => {
    if (moduleOrder === 1) return true; // First module always unlocked
    
    const previousModule = modules.find(m => m.order === moduleOrder - 1);
    if (!previousModule) return false;
    
    const previousProgress = getModuleProgress(previousModule.id);
    return previousProgress?.completed || false;
  };

  const handleNextSection = () => {
    if (!currentModule) return;
    
    const sections = currentModule.content.sections || [];
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Module completed
      updateProgress(currentModule.id, 100, true);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Learning Path Progress */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Your Learning Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{getOverallProgress()}%</span>
              </div>
              <Progress value={getOverallProgress()} className="h-2" />
              
              {/* Module Progress */}
              <div className="space-y-3 mt-6">
                {modules.map((module, index) => {
                  const progress = getModuleProgress(module.id);
                  const isUnlocked = isModuleUnlocked(module.order);
                  const isCompleted = progress?.completed || false;
                  const isCurrent = currentModule?.id === module.id;
                  
                  return (
                    <div 
                      key={module.id} 
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors ${
                        isCurrent ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => isUnlocked && setCurrentModule(module)}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-secondary text-white' 
                          : isCurrent 
                            ? 'bg-primary text-white'
                            : isUnlocked
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-gray-300 text-gray-500'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : isUnlocked ? (
                          <span className="text-xs font-bold">{module.order}</span>
                        ) : (
                          <Lock className="h-3 w-3" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        isUnlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {module.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Content */}
      <div className="lg:col-span-2 space-y-6">
        {currentModule ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Module {currentModule.order}: {currentModule.title}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">{currentModule.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">
                    {getModuleProgress(currentModule.id)?.completed ? 'Completed' : 'In Progress'}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentModule.content.sections?.length || 0} sections
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {currentModule.content.sections && currentModule.content.sections[currentSection] && (
                <div className="space-y-6">
                  {/* Current Section Content */}
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450" 
                      alt="AI facial recognition technology display" 
                      className="w-full h-64 object-cover" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <Play className="text-2xl text-gray-800 ml-1 h-6 w-6" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-semibold">{currentModule.content.sections[currentSection].title}</h4>
                      <p className="text-sm opacity-90">Educational Content</p>
                    </div>
                  </div>

                  {/* Interactive Content */}
                  {currentModule.order === 2 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Quick Check: Can you spot the deepfake?</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                          <img 
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                            alt="Professional headshot" 
                            className="w-full h-32 object-cover rounded mb-2" 
                          />
                          <p className="text-sm font-medium">Image A</p>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                          <img 
                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                            alt="Professional headshot" 
                            className="w-full h-32 object-cover rounded mb-2" 
                          />
                          <p className="text-sm font-medium">Image B</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button variant="outline" className="flex-1">
                          Image A is deepfake
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Image B is deepfake
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Progress and Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      onClick={handlePreviousSection}
                      disabled={currentSection === 0}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex space-x-2">
                      {currentModule.content.sections.map((_: any, index: number) => (
                        <div 
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentSection ? 'bg-primary' : 
                            index < currentSection ? 'bg-secondary' : 'bg-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    
                    <Button
                      onClick={handleNextSection}
                      disabled={currentSection >= (currentModule.content.sections?.length || 0) - 1}
                    >
                      {currentSection >= (currentModule.content.sections?.length || 0) - 1 ? 'Complete' : 'Next'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Book className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Module</h3>
              <p className="text-gray-500">
                Choose a learning module from the sidebar to get started.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Available Modules Preview */}
        <div className="grid md:grid-cols-2 gap-4">
          {modules.slice(2).map((module) => {
            const isUnlocked = isModuleUnlocked(module.order);
            const progress = getModuleProgress(module.id);
            
            return (
              <Card 
                key={module.id} 
                className={!isUnlocked ? 'opacity-50' : 'cursor-pointer hover:shadow-md transition-shadow'}
                onClick={() => isUnlocked && setCurrentModule(module)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      progress?.completed 
                        ? 'bg-secondary text-white' 
                        : isUnlocked 
                          ? 'bg-primary text-white'
                          : 'bg-gray-300 text-gray-500'
                    }`}>
                      {progress?.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : isUnlocked ? (
                        <span className="text-xs font-bold">{module.order}</span>
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </div>
                    <h4 className={`font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {module.title}
                    </h4>
                  </div>
                  <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {module.description}
                  </p>
                  {!isUnlocked && (
                    <div className="mt-3 text-xs text-gray-400">
                      Unlocks after Module {module.order - 1}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
