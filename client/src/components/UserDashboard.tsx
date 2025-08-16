import React, { useState, useEffect } from 'react';
import { BarChart3, Search, AlertTriangle, GraduationCap, Trophy, TrendingUp, FileText, Award, Target, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiCall } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/auth';

interface UserDashboardProps {
  user: User;
}

interface DashboardStats {
  totalAnalyses: number;
  aiDetected: number;
  modulesCompleted: number;
  streakDays: number;
  recentAnalyses: any[];
  achievements: any[];
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await apiCall('/user/dashboard');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500">Start analyzing content to see your dashboard stats.</p>
      </div>
    );
  }

  const getAnalysisIcon = (contentType: string) => {
    switch (contentType) {
      case 'image': return FileText;
      case 'audio': return Search;
      default: return BarChart3;
    }
  };

  const getAnalysisColor = (isAiGenerated: boolean) => {
    return isAiGenerated ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Stats Overview */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAnalyses}</p>
                  <p className="text-sm text-muted-foreground">Content Analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-orange-600 h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.aiDetected}</p>
                  <p className="text-sm text-muted-foreground">AI Content Found</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-secondary h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.modulesCompleted}</p>
                  <p className="text-sm text-muted-foreground">Modules Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Trophy className="text-purple-600 h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.streakDays}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Analysis History */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Analysis History</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentAnalyses && stats.recentAnalyses.length > 0 ? (
              <div className="space-y-4">
                {stats.recentAnalyses.map((analysis, index) => {
                  const IconComponent = getAnalysisIcon(analysis.contentType);
                  const timeAgo = new Date(analysis.createdAt).toLocaleDateString();
                  
                  return (
                    <div 
                      key={analysis.id || index} 
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          analysis.isAiGenerated ? 'bg-orange-100' : 'bg-green-100'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            analysis.isAiGenerated ? 'text-orange-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {analysis.contentType === 'image' ? 'Image Analysis' :
                             analysis.contentType === 'audio' ? 'Audio Analysis' : 'Text Analysis'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round(analysis.overallConfidence * 100)}% confidence • {timeAgo}
                          </p>
                        </div>
                      </div>
                      <Badge className={getAnalysisColor(analysis.isAiGenerated)}>
                        {analysis.isAiGenerated ? 'AI Detected' : 'Human'}
                      </Badge>
                    </div>
                  );
                })}
                
                <Button variant="outline" className="w-full">
                  View All History
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No analysis history yet</p>
                <p className="text-sm">Start analyzing content to see your history here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress & Achievements */}
      <div className="lg:col-span-1 space-y-6">
        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-muted-foreground">65%</span>
                </div>
                <Progress value={65} className="h-3" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Basics</span>
                  <CheckCircle className="text-secondary h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deepfakes</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-3/5" />
                    </div>
                    <span className="text-xs text-muted-foreground">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Source Verification</span>
                  <Target className="text-gray-400 h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Critical Thinking</span>
                  <Target className="text-gray-400 h-4 w-4" />
                </div>
              </div>

              <Button className="w-full bg-secondary hover:bg-secondary/90">
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.achievements && stats.achievements.length > 0 ? (
              <div className="space-y-3">
                {stats.achievements.map((achievement, index) => (
                  <div key={achievement.id || index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="text-yellow-600 h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="text-yellow-600 h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">First Analysis</p>
                    <p className="text-xs text-muted-foreground">Complete your first content analysis</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="text-purple-600 h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Learning Streak</p>
                    <p className="text-xs text-muted-foreground">Use the app for multiple days</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="text-secondary h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Module Master</p>
                    <p className="text-xs text-muted-foreground">Complete learning modules</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
