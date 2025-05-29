
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useResumes } from "@/hooks/useResumes";
import { useToast } from "@/hooks/use-toast";

export default function ATSAnalyzer() {
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const { resumes, updateResume } = useResumes();
  const { toast } = useToast();

  const mockATSAnalysis = (resume: any) => {
    // Mock ATS analysis - in real app, this would call an AI service
    const score = Math.floor(Math.random() * 40) + 60; // Score between 60-100
    
    const suggestions = [
      "Add more relevant keywords for your target role",
      "Include quantifiable achievements in your projects",
      "Ensure your skills section matches job requirements",
      "Add more industry-specific certifications",
      "Improve the formatting for better ATS parsing"
    ];

    const strengths = [
      "Good use of action verbs in project descriptions",
      "Relevant technical skills listed",
      "Clear contact information provided",
      "Education section is well-structured"
    ];

    return {
      score,
      suggestions: suggestions.slice(0, Math.floor(Math.random() * 3) + 2),
      strengths: strengths.slice(0, Math.floor(Math.random() * 2) + 2),
      keywordMatch: Math.floor(Math.random() * 30) + 70,
      readability: Math.floor(Math.random() * 20) + 80,
      formatting: Math.floor(Math.random() * 25) + 75
    };
  };

  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      toast({
        title: "No resume selected",
        description: "Please select a resume to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const resume = resumes.find(r => r.id === selectedResumeId);
      if (resume) {
        const analysis = mockATSAnalysis(resume);
        setAnalysisResult(analysis);
        
        // Update resume with ATS score
        updateResume(selectedResumeId, { atsScore: analysis.score });
        
        toast({
          title: "Analysis complete!",
          description: `Your resume scored ${analysis.score}/100`,
        });
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ATS Score Analyzer</h1>
        <p className="text-gray-600 mt-2">Check how well your resume performs against Applicant Tracking Systems.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resume Analysis
          </CardTitle>
          <CardDescription>
            Select a resume to analyze its ATS compatibility and get improvement suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Resume</label>
            <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a resume to analyze" />
              </SelectTrigger>
              <SelectContent>
                {resumes.map((resume) => (
                  <SelectItem key={resume.id} value={resume.id}>
                    {resume.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={!selectedResumeId || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getScoreIcon(analysisResult.score)}
                ATS Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(analysisResult.score)}`}>
                  {analysisResult.score}
                </div>
                <div className="text-2xl text-gray-600">out of 100</div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {analysisResult.score >= 80 
                      ? "Excellent! Your resume is highly ATS-friendly."
                      : analysisResult.score >= 60
                      ? "Good score, but there's room for improvement."
                      : "Your resume needs significant improvements for ATS compatibility."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Keyword Match</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(analysisResult.keywordMatch)}`}>
                  {analysisResult.keywordMatch}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  How well your resume matches job-relevant keywords
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Readability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(analysisResult.readability)}`}>
                  {analysisResult.readability}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  How easy it is for ATS to parse your content
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Formatting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(analysisResult.formatting)}`}>
                  {analysisResult.formatting}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  How well your resume is structured for ATS
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {resumes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes to analyze</h3>
            <p className="text-gray-600 mb-6">Create a resume first to get started with ATS analysis.</p>
            <Button asChild>
              <a href="/create">Create Your First Resume</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
