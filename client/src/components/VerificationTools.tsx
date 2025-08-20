import React, { useState } from 'react';
import { Search, Network, Shield, Users, Eye, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type User } from '@/lib/auth';

interface VerificationToolsProps {
  user: User | null;
  onAuthRequired: () => void;
}

export function VerificationTools({ user, onAuthRequired }: VerificationToolsProps) {
  const [quickVerifyText, setQuickVerifyText] = useState('');

  const verificationTools = [
    {
      id: 'reverse-image-search',
      title: 'Reverse Image Search',
      description: 'Verify the origin and context of images by searching across the web.',
      icon: Search,
      action: 'Search Image'
    },
    {
      id: 'fact-check-network',
      title: 'Fact-Check Network',
      description: 'Access a wide network of trusted fact-checking organizations and databases.',
      icon: Network,
      action: 'Explore Network'
    },
    {
      id: 'source-credibility',
      title: 'Source Credibility',
      description: 'Evaluate the trustworthiness of news sources, websites, and authors.',
      icon: Shield,
      action: 'Analyze Source'
    },
    {
      id: 'community-verification',
      title: 'Community Verification',
      description: 'Leverage community insights and collective intelligence for verification.',
      icon: Users,
      action: 'Join Community'
    }
  ];

  const handleToolClick = (toolId: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }
    // Handle tool functionality
    console.log(`Opening ${toolId} tool`);
  };

  const handleQuickVerify = () => {
    if (!quickVerifyText.trim()) return;
    
    if (!user) {
      onAuthRequired();
      return;
    }
    
    console.log('Quick verification:', quickVerifyText);
  };

  return (
    <div className="space-y-8">
      {/* Quick Verification Section */}
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Quick Verification</h2>
          <p className="text-gray-600">Enter text, image URL, or video link to perform a quick verification.</p>
          
          <div className="max-w-2xl mx-auto space-y-4">
            <Input
              placeholder="Paste link or text here..."
              value={quickVerifyText}
              onChange={(e) => setQuickVerifyText(e.target.value)}
              className="text-center"
              data-testid="input-quick-verify"
            />
            <Button 
              onClick={handleQuickVerify}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              data-testid="button-verify"
            >
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tools Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">Explore Our Tools</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {verificationTools.map((tool) => {
            const IconComponent = tool.icon;
            
            return (
              <Card key={tool.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-gray-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{tool.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
                  </div>
                  
                  <Button 
                    onClick={() => handleToolClick(tool.id)}
                    variant="outline"
                    className="w-full"
                    data-testid={`button-${tool.id}`}
                  >
                    {tool.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {!user && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-purple-600 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <p className="text-purple-800 font-medium">
                Unlock the full potential of these tools by signing in and gaining access to advanced features.
              </p>
              <Button 
                onClick={onAuthRequired}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                data-testid="button-unlock-tools"
              >
                Sign In to Unlock
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}