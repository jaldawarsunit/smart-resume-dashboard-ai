
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useResumes } from "@/hooks/useResumes";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, AlertCircle, CheckCircle, XCircle, Target, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ATSAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
  keywords: string[];
  missingKeywords: string[];
  formatIssues: string[];
  strengths: string[];
}

export default function ATSAnalyzer() {
  const { resumes, updateResume } = useResumes();
  const { toast } = useToast();
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeResume = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a resume and provide a job description",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedResume = resumes.find(r => r.id === selectedResumeId);
    if (!selectedResume) return;

    // AI-powered ATS analysis simulation
    const resumeText = `${selectedResume.basicInfo.name} ${selectedResume.basicInfo.email} ${selectedResume.targetJobRole} ${selectedResume.skills.join(' ')} ${selectedResume.projects.map(p => p.title + ' ' + p.description + ' ' + p.technologies.join(' ')).join(' ')} ${selectedResume.education.collegeName}`;
    
    const jobKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);
    
    const matchingKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.some(rKeyword => rKeyword.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeKeywords.some(rKeyword => rKeyword.toLowerCase().includes(keyword.toLowerCase()))
    );

    // Calculate score based on various factors
    let score = 60; // Base score
    
    // Keyword matching (30% of score)
    const keywordScore = (matchingKeywords.length / Math.max(jobKeywords.length, 1)) * 30;
    score += keywordScore;
    
    // Format and structure checks (20% of score)
    const formatScore = checkFormat(selectedResume);
    score += formatScore;
    
    // Content quality (20% of score)
    const contentScore = checkContent(selectedResume);
    score += contentScore;
    
    score = Math.min(Math.round(score), 100);

    const analysisResult: ATSAnalysis = {
      score,
      keywords: matchingKeywords,
      missingKeywords: missingKeywords.slice(0, 10), // Limit to top 10
      issues: generateIssues(selectedResume, missingKeywords),
      suggestions: generateSuggestions(selectedResume, missingKeywords),
      formatIssues: getFormatIssues(selectedResume),
      strengths: getStrengths(selectedResume, matchingKeywords)
    };

    setAnalysis(analysisResult);
    
    // Update resume with ATS score
    await updateResume(selectedResumeId, { atsScore: score });
    
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Your resume scored ${score}/100 for ATS compatibility`,
    });
  };

  const extractKeywords = (text: string): string[] => {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .filter((word, index, arr) => arr.indexOf(word) === index)
      .slice(0, 50); // Limit to top 50 keywords
  };

  const checkFormat = (resume: any): number => {
    let score = 0;
    
    // Basic info completeness
    if (resume.basicInfo.name && resume.basicInfo.email && resume.basicInfo.phone) score += 5;
    
    // Skills section
    if (resume.skills.length > 0) score += 5;
    
    // Experience/Projects
    if (resume.projects.length > 0) score += 5;
    
    // Education
    if (resume.education.collegeName) score += 5;
    
    return score;
  };

  const checkContent = (resume: any): number => {
    let score = 0;
    
    // Skills count
    if (resume.skills.length >= 5) score += 5;
    if (resume.skills.length >= 10) score += 5;
    
    // Projects detail
    if (resume.projects.some((p: any) => p.description.length > 50)) score += 5;
    if (resume.projects.length >= 2) score += 5;
    
    return score;
  };

  const generateIssues = (resume: any, missingKeywords: string[]): string[] => {
    const issues = [];
    
    if (missingKeywords.length > 5) {
      issues.push(`Missing ${missingKeywords.length} important keywords from job description`);
    }
    
    if (resume.skills.length < 5) {
      issues.push("Skills section needs more relevant technical skills");
    }
    
    if (resume.projects.length < 2) {
      issues.push("Add more projects to demonstrate experience");
    }
    
    if (!resume.basicInfo.phone) {
      issues.push("Missing phone number in contact information");
    }
    
    return issues;
  };

  const generateSuggestions = (resume: any, missingKeywords: string[]): string[] => {
    const suggestions = [];
    
    if (missingKeywords.length > 0) {
      suggestions.push(`Include these keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
    }
    
    suggestions.push("Use action verbs to start bullet points (e.g., 'Developed', 'Implemented', 'Led')");
    suggestions.push("Quantify achievements with numbers and percentages where possible");
    suggestions.push("Tailor your resume for each specific job application");
    suggestions.push("Use industry-standard section headings like 'Experience', 'Skills', 'Education'");
    
    return suggestions;
  };

  const getFormatIssues = (resume: any): string[] => {
    const issues = [];
    
    if (!resume.basicInfo.name) issues.push("Missing name in header");
    if (!resume.basicInfo.email) issues.push("Missing email address");
    if (!resume.basicInfo.phone) issues.push("Missing phone number");
    
    return issues;
  };

  const getStrengths = (resume: any, matchingKeywords: string[]): string[] => {
    const strengths = [];
    
    if (matchingKeywords.length > 5) {
      strengths.push(`Strong keyword match with ${matchingKeywords.length} relevant terms`);
    }
    
    if (resume.skills.length >= 8) {
      strengths.push("Comprehensive skills section");
    }
    
    if (resume.projects.length >= 2) {
      strengths.push("Good project portfolio demonstrating experience");
    }
    
    if (resume.education.collegeName && resume.education.cgpa) {
      strengths.push("Complete education information with grades");
    }
    
    return strengths;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">ATS Analyzer</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Check how well your resume performs with Applicant Tracking Systems
        </p>
      </div>

      {/* Analysis Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resume Analysis Setup
          </CardTitle>
          <CardDescription>
            Select a resume and provide the job description you're targeting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume-select">Select Resume</Label>
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

          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here. Include requirements, skills, and responsibilities..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px]"
            />
          </div>

          <Button 
            onClick={analyzeResume} 
            disabled={isAnalyzing || !selectedResumeId || !jobDescription.trim()}
            className="w-full gap-2"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Analyze Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Score */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>ATS Score</CardTitle>
              <CardDescription>Overall compatibility rating</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}
                </div>
                <div className="text-xl text-gray-500">/100</div>
                <div className={`text-lg font-medium ${getScoreColor(analysis.score)}`}>
                  {getScoreLevel(analysis.score)}
                </div>
              </div>
              <Progress value={analysis.score} className="w-full" />
            </CardContent>
          </Card>

          {/* Keywords Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Keyword Analysis</CardTitle>
              <CardDescription>How well your resume matches the job requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Matching Keywords ({analysis.keywords.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.slice(0, 10).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {analysis.missingKeywords.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Missing Keywords ({analysis.missingKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.slice(0, 10).map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-red-300 text-red-600">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Issues */}
          {analysis.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Issues Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
