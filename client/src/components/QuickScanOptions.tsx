import React from 'react';
import { Zap, Search, Users, Brain, Eye, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type User } from '@/lib/auth';

interface QuickScanOptionsProps {
  user: User | null;
  onAuthRequired: () => void;
}

export function QuickScanOptions({ user, onAuthRequired }: QuickScanOptionsProps) {
  const scanOptions = [
    {
      id: 'quick-scan',
      title: 'Quick Scan',
      description: 'Perform a rapid check for basic credibility signals and immediate red flags.',
      icon: Zap,
      action: 'Start Scan'
    },
    {
      id: 'deep-analysis',
      title: 'Deep Analysis',
      description: 'Conduct a thorough, multi-faceted analysis covering source, bias, and factual accuracy.',
      icon: Brain,
      action: 'Begin Deep Scan'
    },
    {
      id: 'expert-review',
      title: 'Expert Review',
      description: 'Submit content for review by MIL Guard\'s expert community or certified analysts.',
      icon: Users,
      action: 'Request Review'
    }
  ];

  const handleScanClick = (scanId: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }
    // Handle scan functionality
    console.log(`Starting ${scanId} scan`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900">Quick Scan Options</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {scanOptions.map((option) => {
          const IconComponent = option.icon;
          
          return (
            <Card key={option.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <IconComponent className="h-8 w-8 text-gray-600" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{option.description}</p>
                </div>
                
                <Button 
                  onClick={() => handleScanClick(option.id)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  data-testid={`button-${option.id}`}
                >
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!user && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-blue-800">
              <Eye className="h-5 w-5" />
              <span className="text-sm">Sign in to save your analysis reports and track your media literacy progress.</span>
            </div>
            <Button 
              onClick={onAuthRequired}
              variant="link" 
              className="text-blue-600 hover:text-blue-800 mt-2"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}