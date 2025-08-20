import React from 'react';
import { Zap, Search, Users, AlertTriangle } from 'lucide-react';
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
      description: 'Basic authenticity check',
      icon: '⚡',
      color: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'deep-analysis',
      title: 'Deep Analysis',
      description: 'Comprehensive AI detection',
      icon: '⚠️',
      color: 'bg-orange-50 border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      id: 'expert-review',
      title: 'Expert Review',
      description: 'Human verification',
      icon: '👥',
      color: 'bg-purple-50 border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  const handleScanClick = (scanId: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }
    console.log(`Starting ${scanId} scan`);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {scanOptions.map((option) => (
        <Card key={option.id} className={`${option.color} hover:shadow-md transition-shadow`}>
          <CardContent className="p-6 text-center space-y-4">
            <div className={`w-12 h-12 mx-auto ${option.iconBg} rounded-full flex items-center justify-center`}>
              <span className="text-2xl">{option.icon}</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">{option.title}</h3>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
            
            <Button 
              onClick={() => handleScanClick(option.id)}
              className="w-full bg-black hover:bg-gray-800 text-white text-sm"
              data-testid={`button-${option.id}`}
            >
              {option.id === 'quick-scan' ? 'Start Scan' : 
               option.id === 'deep-analysis' ? 'Begin Deep Scan' : 'Request Review'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}