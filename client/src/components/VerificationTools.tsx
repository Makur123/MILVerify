import React, { useState } from 'react';
import { Search, Shield, ExternalLink, MapPin, Clock, Satellite, Globe, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from './FileUpload';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/auth';

interface VerificationToolsProps {
  user: User | null;
  onAuthRequired: () => void;
}

export function VerificationTools({ user, onAuthRequired }: VerificationToolsProps) {
  const [sourceUrl, setSourceUrl] = useState('');
  const [credibilityResult, setCredibilityResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleReverseImageSearch = (file: File) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    // Simulate reverse image search
    toast({
      title: "Reverse Image Search",
      description: "Image search initiated across multiple platforms",
    });
  };

  const analyzeSourceCredibility = async () => {
    if (!sourceUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a URL to analyze",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate credibility analysis
    setTimeout(() => {
      const mockResult = {
        credibilityScore: 4,
        domain: new URL(sourceUrl).hostname,
        factors: [
          "Established news organization",
          "Transparent editorial policies", 
          "Multiple author verification",
          "Regular fact-checking"
        ],
        warnings: [],
        recommendation: "High credibility source"
      };
      
      setCredibilityResult(mockResult);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Source credibility has been assessed",
      });
    }, 2000);
  };

  const factCheckResources = [
    { name: "Snopes", url: "https://snopes.com", icon: CheckCircle },
    { name: "FactCheck.org", url: "https://factcheck.org", icon: CheckCircle },
    { name: "PolitiFact", url: "https://politifact.com", icon: CheckCircle },
    { name: "AP Fact Check", url: "https://apnews.com/hub/ap-fact-check", icon: CheckCircle },
  ];

  const osintTools = [
    { name: "Geolocation Verification", icon: MapPin, description: "Verify location claims" },
    { name: "Timestamp Analysis", icon: Clock, description: "Check content timing" },
    { name: "Satellite Imagery", icon: Satellite, description: "Access historical imagery" },
    { name: "Wayback Machine", icon: Globe, description: "View historical versions" },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Reverse Image Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="text-primary mr-2 h-5 w-5" />
            Reverse Image Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            type="image"
            accept="image/*"
            onFileSelect={handleReverseImageSearch}
            className="mb-4"
          />
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Search across:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Google Images</Badge>
              <Badge variant="secondary">TinEye</Badge>
              <Badge variant="secondary">Yandex</Badge>
              <Badge variant="secondary">Bing</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fact Checking Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="text-secondary mr-2 h-5 w-5" />
            Fact Checking Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {factCheckResources.map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ExternalLink className="text-primary h-4 w-4" />
                  <span className="font-medium">{resource.name}</span>
                </div>
                <ExternalLink className="text-gray-400 h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Quick Verification Checklist</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>✓ Check multiple independent sources</li>
              <li>✓ Verify the publication date</li>
              <li>✓ Look for original source attribution</li>
              <li>✓ Consider the context and motivation</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Source Credibility Checker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="text-primary mr-2 h-5 w-5" />
            Source Credibility Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sourceUrl">Enter URL or domain</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="sourceUrl"
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://example.com"
                />
                <Button onClick={analyzeSourceCredibility} disabled={isAnalyzing}>
                  {isAnalyzing ? 'Checking...' : 'Check'}
                </Button>
              </div>
            </div>
            
            {/* Analysis Result */}
            {credibilityResult && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-900">{credibilityResult.recommendation}</span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < credibilityResult.credibilityScore ? 'text-green-600 fill-current' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-2">Domain: {credibilityResult.domain}</p>
                  <ul className="space-y-1">
                    {credibilityResult.factors.map((factor: string, index: number) => (
                      <li key={index}>✓ {factor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* OSINT Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Satellite className="text-primary mr-2 h-5 w-5" />
            OSINT Investigation Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {osintTools.map((tool) => (
              <Button
                key={tool.name}
                variant="outline"
                className="w-full justify-between h-auto p-4"
                onClick={() => {
                  if (!user) {
                    onAuthRequired();
                    return;
                  }
                  toast({
                    title: tool.name,
                    description: `Opening ${tool.name} tool...`,
                  });
                }}
              >
                <div className="flex items-center space-x-3">
                  <tool.icon className="text-primary h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-sm text-gray-500">{tool.description}</div>
                  </div>
                </div>
                <ExternalLink className="text-gray-400 h-4 w-4" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
