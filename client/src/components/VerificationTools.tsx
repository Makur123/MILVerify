import React, { useState } from 'react';
import { Search, Network, Shield, Users, Eye, ExternalLink, CheckCircle, Upload, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { type User } from '@/lib/auth';
import { FileUpload } from './FileUpload';

interface VerificationToolsProps {
  user: User | null;
  onAuthRequired: () => void;
}

export function VerificationTools({ user, onAuthRequired }: VerificationToolsProps) {
  const [quickVerifyText, setQuickVerifyText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<any>(null);
  const { toast } = useToast();

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

  const handleReverseImageSearch = async (file?: File) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setIsVerifying(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
      } else if (quickVerifyText.includes('http')) {
        formData.append('imageUrl', quickVerifyText);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Input",
          description: "Please provide an image file or URL"
        });
        return;
      }

      const response = await fetch('/api/verify/reverse-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Verification failed');
      
      const data = await response.json();
      setVerificationResults({
        type: 'reverse-image',
        data: data.verificationResults
      });

      toast({
        title: "Verification Complete",
        description: "Image verification analysis ready"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify image"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFactCheck = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    if (!quickVerifyText.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter a claim or URL to fact-check"
      });
      return;
    }

    setIsVerifying(true);
    try {
      const isUrl = quickVerifyText.includes('http');
      const requestBody = isUrl 
        ? { url: quickVerifyText }
        : { claim: quickVerifyText };

      const response = await fetch('/api/verify/fact-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Fact-check failed');
      
      const data = await response.json();
      setVerificationResults({
        type: 'fact-check',
        data: data.factCheckResults
      });

      toast({
        title: "Fact-Check Complete",
        description: "Analysis results are ready"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fact-Check Failed",
        description: error instanceof Error ? error.message : "Failed to fact-check content"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSourceCredibility = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    if (!quickVerifyText.trim() || !quickVerifyText.includes('http')) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter a valid URL for source analysis"
      });
      return;
    }

    setIsVerifying(true);
    try {
      const url = new URL(quickVerifyText);
      const response = await fetch('/api/verify/source-credibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ 
          url: quickVerifyText,
          domain: url.hostname 
        })
      });

      if (!response.ok) throw new Error('Source analysis failed');
      
      const data = await response.json();
      setVerificationResults({
        type: 'source-credibility',
        data: data.credibilityResults
      });

      toast({
        title: "Source Analysis Complete",
        description: "Credibility assessment ready"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze source"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQuickVerify = () => {
    if (!quickVerifyText.trim()) return;
    
    if (quickVerifyText.includes('http')) {
      if (quickVerifyText.includes('.jpg') || quickVerifyText.includes('.png') || quickVerifyText.includes('.jpeg')) {
        handleReverseImageSearch();
      } else {
        handleSourceCredibility();
      }
    } else {
      handleFactCheck();
    }
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
              disabled={isVerifying}
              className="bg-black hover:bg-gray-800 text-white px-4 sm:px-6 w-full sm:w-auto text-sm"
              data-testid="button-verify"
            >
              {isVerifying ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Verifying...</>
              ) : (
                <>🔍 Verify</>
              )}
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
            <div className="space-y-2">
              <Button 
                onClick={() => handleReverseImageSearch()}
                disabled={isVerifying}
                className="w-full bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
                data-testid="button-reverse-image-search"
              >
                Search Images 🔗
              </Button>
              <FileUpload
                type="image"
                onFileSelect={handleReverseImageSearch}
                accept="image/*"
                maxSize={10}
                className="text-xs"
              />
            </div>
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
              onClick={handleFactCheck}
              disabled={isVerifying}
              className="w-full bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              data-testid="button-fact-check-network"
            >
              Check Facts ✓
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
              onClick={handleSourceCredibility}
              disabled={isVerifying}
              className="w-full bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              data-testid="button-source-credibility"
            >
              Analyze Source 📊
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
              onClick={() => {
                if (!user) {
                  onAuthRequired();
                  return;
                }
                toast({
                  title: "Community Feature",
                  description: "Community verification feature coming soon"
                });
              }}
              className="w-full bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              data-testid="button-community-verification"
            >
              Join Community 👥
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Verification Results */}
      {verificationResults && (
        <Card className="border-gray-200">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Verification Results</h3>
              <Badge variant="outline" className="text-xs">
                {verificationResults.type === 'reverse-image' ? 'Image Analysis' :
                 verificationResults.type === 'fact-check' ? 'Fact Check' : 'Source Analysis'}
              </Badge>
            </div>

            {verificationResults.type === 'reverse-image' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Manipulation Detected:</span>
                  <Badge variant={verificationResults.data.manipulationDetected ? "destructive" : "secondary"}>
                    {verificationResults.data.manipulationDetected ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Confidence: </span>
                  {Math.round(verificationResults.data.confidence * 100)}%
                </div>
                {verificationResults.data.originalSources?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Original Sources Found:</p>
                    <div className="space-y-1">
                      {verificationResults.data.originalSources.slice(0, 3).map((source: string, idx: number) => (
                        <div key={idx} className="text-xs text-blue-600 hover:underline cursor-pointer">
                          {source}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {verificationResults.type === 'fact-check' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={
                    verificationResults.data.verificationStatus === 'verified' ? 'default' :
                    verificationResults.data.verificationStatus === 'false' ? 'destructive' : 'secondary'
                  }>
                    {verificationResults.data.verificationStatus}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Confidence: </span>
                  {Math.round(verificationResults.data.confidence * 100)}%
                </div>
                {verificationResults.data.sources?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Supporting Sources:</p>
                    <div className="space-y-1">
                      {verificationResults.data.sources.slice(0, 3).map((source: string, idx: number) => (
                        <div key={idx} className="text-xs text-green-600">
                          ✓ {source}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {verificationResults.type === 'source-credibility' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Credibility Score:</span>
                  <Badge variant={
                    verificationResults.data.credibilityScore > 0.7 ? 'default' :
                    verificationResults.data.credibilityScore > 0.4 ? 'secondary' : 'destructive'
                  }>
                    {Math.round(verificationResults.data.credibilityScore * 100)}%
                  </Badge>
                </div>
                {verificationResults.data.trustFactors?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Trust Factors:</p>
                    <div className="space-y-1">
                      {verificationResults.data.trustFactors.slice(0, 3).map((factor: string, idx: number) => (
                        <div key={idx} className="text-xs text-green-600">
                          ✓ {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {verificationResults.data.riskFactors?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Risk Factors:</p>
                    <div className="space-y-1">
                      {verificationResults.data.riskFactors.slice(0, 3).map((factor: string, idx: number) => (
                        <div key={idx} className="text-xs text-red-600">
                          ⚠ {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {verificationResults.data.note && (
              <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                ℹ {verificationResults.data.note}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}