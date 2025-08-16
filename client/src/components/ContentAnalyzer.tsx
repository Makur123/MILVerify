import React, { useState } from 'react';
import { Upload, Search, Brain, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileUpload } from './FileUpload';
import { uploadFile, apiCall } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import type { User } from '@/lib/auth';

interface ContentAnalyzerProps {
  user: User | null;
  onAnalysisComplete: (results: any) => void;
  onAuthRequired: () => void;
}

export function ContentAnalyzer({ user, onAnalysisComplete, onAuthRequired }: ContentAnalyzerProps) {
  const [analysisText, setAnalysisText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResults, setCurrentResults] = useState<any>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleTextAnalysis = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    if (!analysisText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter some text to analyze",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await apiCall('/analyze/text', {
        method: 'POST',
        body: JSON.stringify({ text: analysisText }),
      });
      
      const data = await response.json();
      setCurrentResults(data.results);
      onAnalysisComplete(data.results);
      
      toast({
        title: "Analysis Complete",
        description: "Your content has been analyzed successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze content",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/analyze/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user ? localStorage.getItem('auth_token') : ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setCurrentResults(data.results);
      onAnalysisComplete(data.results);
      
      toast({
        title: "Image Analysis Complete",
        description: "Your image has been analyzed for AI generation",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAudioUpload = async (file: File) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('audio', file);
      
      const response = await fetch('/api/analyze/audio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user ? localStorage.getItem('auth_token') : ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setCurrentResults(data.results);
      onAnalysisComplete(data.results);
      
      toast({
        title: "Audio Analysis Complete",
        description: "Your audio has been analyzed for AI generation",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze audio",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.7) return "text-red-700";
    if (confidence > 0.4) return "text-orange-700";
    return "text-green-700";
  };

  const getConfidenceBackground = (confidence: number) => {
    if (confidence > 0.7) return "bg-red-50 border-red-200";
    if (confidence > 0.4) return "bg-orange-50 border-orange-200";
    return "bg-green-50 border-green-200";
  };

  return (
    <div className={`${isMobile ? 'space-y-6' : 'grid lg:grid-cols-2 gap-8'}`}>
      {/* Upload Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm sm:text-base">
              <Upload className="text-primary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Upload Content for Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUpload
              type="image"
              accept="image/*"
              onFileSelect={handleImageUpload}
            />
            <FileUpload
              type="audio"
              accept="audio/*"
              onFileSelect={handleAudioUpload}
            />
          </CardContent>
        </Card>

        {/* Text Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm sm:text-base">
              <Search className="text-primary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Text Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={analysisText}
              onChange={(e) => setAnalysisText(e.target.value)}
              placeholder="Paste or type text content to analyze for AI generation..."
              className={`${isMobile ? 'h-24' : 'h-32'} resize-none`}
              maxLength={5000}
            />
            <div className={`mt-4 flex ${isMobile ? 'flex-col space-y-2' : 'justify-between items-center'}`}>
              <span className="text-sm text-muted-foreground">
                {analysisText.length}/5000 characters
              </span>
              <Button
                onClick={handleTextAnalysis}
                disabled={isAnalyzing || !analysisText.trim()}
                className={isMobile ? 'w-full' : ''}
              >
                <Search className="mr-2 h-4 w-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm sm:text-base">
              <Brain className="text-primary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Analyzing content...</p>
              </div>
            ) : currentResults ? (
              <div className="space-y-4">
                {/* Overall Result */}
                <div className={`p-4 border rounded-lg ${getConfidenceBackground(currentResults.overall.confidence)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {currentResults.overall.isAiGenerated ? (
                        <AlertTriangle className="text-orange-600 mr-2 h-5 w-5" />
                      ) : (
                        <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                      )}
                      <span className={`font-semibold ${getConfidenceColor(currentResults.overall.confidence)}`}>
                        {currentResults.overall.isAiGenerated ? 'AI Content Detected' : 'Human Content Detected'}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${getConfidenceColor(currentResults.overall.confidence)}`}>
                      {Math.round(currentResults.overall.confidence * 100)}% Confidence
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Detection Confidence</span>
                      <span className="font-medium">{Math.round(currentResults.overall.confidence * 100)}%</span>
                    </div>
                    <Progress value={currentResults.overall.confidence * 100} className="h-2" />
                  </div>
                  
                  <p className={`text-sm ${getConfidenceColor(currentResults.overall.confidence)}`}>
                    {currentResults.overall.reasoning}
                  </p>
                </div>

                {/* Detection Service Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Detection Service Results:</h4>
                  
                  {currentResults.openai && (
                    <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'justify-between'} p-3 bg-gray-50 rounded-lg`}>
                      <div className="flex items-center">
                        <Brain className="text-primary mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">OpenAI</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${isMobile ? 'w-full' : ''}`}>
                        <span className="text-sm">{Math.round(currentResults.openai.confidence * 100)}% AI</span>
                        <div className={`${isMobile ? 'flex-1' : 'w-16'} bg-gray-200 rounded-full h-2`}>
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${currentResults.openai.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentResults.gptZero && (
                    <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'justify-between'} p-3 bg-gray-50 rounded-lg`}>
                      <div className="flex items-center">
                        <Search className="text-primary mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">GPTZero</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${isMobile ? 'w-full' : ''}`}>
                        <span className="text-sm">{Math.round(currentResults.gptZero.confidence * 100)}% AI</span>
                        <div className={`${isMobile ? 'flex-1' : 'w-16'} bg-gray-200 rounded-full h-2`}>
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${currentResults.gptZero.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentResults.aiOrNot && (
                    <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'justify-between'} p-3 bg-gray-50 rounded-lg`}>
                      <div className="flex items-center">
                        <CheckCircle className="text-primary mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">AI or Not</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${isMobile ? 'w-full' : ''}`}>
                        <span className="text-sm">{Math.round(currentResults.aiOrNot.confidence * 100)}% AI</span>
                        <div className={`${isMobile ? 'flex-1' : 'w-16'} bg-gray-200 rounded-full h-2`}>
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${currentResults.aiOrNot.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommended Actions */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Recommended Actions
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Verify information through multiple independent sources</li>
                    <li>• Check the original publication date and context</li>
                    <li>• Look for corroborating evidence from credible sources</li>
                    <li>• Consider the motivation behind sharing this content</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Upload content or enter text to see analysis results</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick MIL Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm sm:text-base">
              <Lightbulb className="text-secondary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Media Literacy Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">The SIFT Method</h4>
              <p className="text-sm text-green-800 mb-3">
                <strong>S</strong>top - Pause before sharing<br />
                <strong>I</strong>nvestigate the source - Who created this?<br />
                <strong>F</strong>ind better coverage - What do other sources say?<br />
                <strong>T</strong>race claims - What's the original source?
              </p>
              <Button variant="link" className="text-green-700 hover:text-green-800 p-0">
                Learn more about SIFT →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
