import React from 'react';
import { BarChart3, Calendar, FileText, Download, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/lib/auth';

interface DetectionResultsProps {
  results: any;
  user: User | null;
}

export function DetectionResults({ results, user }: DetectionResultsProps) {
  if (!results) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
        <p className="text-gray-500">
          Analyze some content first to see detailed detection results here.
        </p>
      </div>
    );
  }

  const confidencePercentage = Math.round(results.overall.confidence * 100);
  const isAiGenerated = results.overall.isAiGenerated;

  const getResultColor = (confidence: number) => {
    if (confidence > 0.7) return "destructive";
    if (confidence > 0.4) return "default";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Detection Summary
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                isAiGenerated ? 'text-orange-600' : 'text-green-600'
              }`}>
                {confidencePercentage}%
              </div>
              <p className="text-sm text-gray-600">Overall Confidence</p>
              <Badge 
                variant={getResultColor(results.overall.confidence)}
                className="mt-2"
              >
                {isAiGenerated ? 'AI Generated' : 'Human Created'}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-blue-600">
                {Object.keys(results).filter(key => key !== 'overall').length}
              </div>
              <p className="text-sm text-gray-600">Detection Services</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-purple-600">
                {results.overall.indicators?.length || 0}
              </div>
              <p className="text-sm text-gray-600">Key Indicators</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Analysis Reasoning</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {results.overall.reasoning}
              </p>
            </div>

            {results.overall.indicators && results.overall.indicators.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Key Indicators</h4>
                <div className="space-y-2">
                  {results.overall.indicators.map((indicator: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm text-gray-700">{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Service-by-Service Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(results)
              .filter(([key]) => key !== 'overall')
              .map(([service, result]: [string, any]) => (
                <div key={service} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium capitalize">{service}</h4>
                    <Badge variant={result.isAiGenerated ? "destructive" : "secondary"}>
                      {Math.round(result.confidence * 100)}% {result.isAiGenerated ? 'AI' : 'Human'}
                    </Badge>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        result.isAiGenerated ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  
                  {result.reasoning && (
                    <p className="text-sm text-gray-600 mt-2">{result.reasoning}</p>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps for Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium">Cross-reference with original sources</h4>
                <p className="text-sm text-gray-600">Look for the original publication or creator of this content</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-medium">Check multiple detection services</h4>
                <p className="text-sm text-gray-600">Use additional AI detection tools for consensus</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-medium">Verify through contextual analysis</h4>
                <p className="text-sm text-gray-600">Consider the context, timing, and source credibility</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
