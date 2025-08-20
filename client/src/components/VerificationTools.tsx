import React, { useState } from 'react';
import { Search, Network, Shield, Users, Eye, ExternalLink, CheckCircle } from 'lucide-react';
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
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Verification Tools</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
          Comprehensive tools for verifying content authenticity and source credibility
        </p>
      </div>

      {/* Quick Verification Section */}
      <Card className="border-gray-200">
        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Quick Verification</h3>
          <p className="text-xs sm:text-sm text-gray-600">Paste a URL, claim, or upload content for instant verification</p>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              placeholder="Enter URL, text or upload file for quick verification..."
              value={quickVerifyText}
              onChange={(e) => setQuickVerifyText(e.target.value)}
              className="flex-1 bg-gray-50 text-sm"
              data-testid="input-quick-verify"
            />
            <Button 
              onClick={handleQuickVerify}
              className="bg-black hover:bg-gray-800 text-white px-4 sm:px-6 w-full sm:w-auto text-sm"
              data-testid="button-verify"
            >
              🔍 Verify
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Reverse Image Search</h3>
                <p className="text-xs sm:text-sm text-gray-600">Find the original source of images and detect manipulations</p>
              </div>
            </div>
            <Button 
              onClick={() => handleToolClick('reverse-image-search')}
              className="w-full bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              data-testid="button-reverse-image-search"
            >
              Search Images 🔗
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Fact-Check Network</h3>
                <p className="text-xs sm:text-sm text-gray-600">Cross-reference claims with verified fact-checking databases</p>
              </div>
            </div>
            <Button 
              onClick={() => handleToolClick('fact-check-network')}
              className="w-full bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              data-testid="button-fact-check-network"
            >
              Check Facts 🔗
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Source Credibility</h3>
                <p className="text-xs sm:text-sm text-gray-600">Evaluate the trustworthiness of news sources, websites, and authors.</p>
              </div>
            </div>
            <Button 
              onClick={() => handleToolClick('source-credibility')}
              className="w-full bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              data-testid="button-source-credibility"
            >
              Analyze Source
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Community Verification</h3>
                <p className="text-xs sm:text-sm text-gray-600">Leverage community insights and collective intelligence for verification.</p>
              </div>
            </div>
            <Button 
              onClick={() => handleToolClick('community-verification')}
              className="w-full bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              data-testid="button-community-verification"
            >
              Join Community
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}