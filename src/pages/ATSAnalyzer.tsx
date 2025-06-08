import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useResumes } from "@/hooks/useResumes";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, AlertCircle, CheckCircle, XCircle, Target, TrendingUp, Eye, Download, BarChart3 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ATSAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
  keywords: string[];
  missingKeywords: string[];
  formatIssues: string[];
  strengths: string[];
  readabilityScore: number;
  keywordDensity: number;
  sectionsFound: string[];
  missingSections: string[];
  contactInfoComplete: boolean;
  skillsCount: number;
  experienceYears: number;
  educationLevel: string;
}

interface ExtractedData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export default function ATSAnalyzer() {
  const { resumes, updateResume } = useResumes();
  const { toast } = useToast();
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('setup');

  const extractResumeData = (resume: any): ExtractedData => {
    return {
      personalInfo: {
        name: resume.basicInfo.name || '',
        email: resume.basicInfo.email || '',
        phone: resume.basicInfo.phone || '',
        location: resume.basicInfo.location || ''
      },
      skills: resume.skills || [],
      experience: resume.experience || [],
      education: resume.education ? [{
        degree: resume.education.degree || '',
        institution: resume.education.collegeName || '',
        year: resume.education.graduationYear || '',
        gpa: resume.education.cgpa || ''
      }] : [],
      projects: resume.projects || []
    };
  };

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
    setActiveTab('analysis');
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const selectedResume = resumes.find(r => r.id === selectedResumeId);
    if (!selectedResume) return;

    // Extract resume data
    const extractedResumeData = extractResumeData(selectedResume);
    setExtractedData(extractedResumeData);

    // Build comprehensive resume text for analysis
    const resumeText = [
      extractedResumeData.personalInfo.name,
      extractedResumeData.personalInfo.email,
      extractedResumeData.personalInfo.phone,
      extractedResumeData.personalInfo.location,
      selectedResume.targetJobRole,
      ...extractedResumeData.skills,
      ...extractedResumeData.projects.map(p => `${p.name} ${p.description} ${p.technologies.join(' ')}`),
      ...extractedResumeData.education.map(e => `${e.degree} ${e.institution} ${e.year}`),
      ...extractedResumeData.experience.map(e => `${e.title} ${e.company} ${e.description.join(' ')}`)
    ].join(' ');
    
    // Advanced keyword extraction
    const jobKeywords = extractAdvancedKeywords(jobDescription);
    const resumeKeywords = extractAdvancedKeywords(resumeText);
    
    const matchingKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.some(rKeyword => 
        rKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(rKeyword.toLowerCase())
      )
    );
    
    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeKeywords.some(rKeyword => 
        rKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(rKeyword.toLowerCase())
      )
    );

    // Calculate comprehensive score
    let score = 0;
    
    // Keyword matching (35% of score)
    const keywordScore = (matchingKeywords.length / Math.max(jobKeywords.length, 1)) * 35;
    score += keywordScore;
    
    // Format and structure (25% of score)
    const formatScore = checkAdvancedFormat(selectedResume, extractedResumeData);
    score += formatScore;
    
    // Content quality (25% of score)
    const contentScore = checkAdvancedContent(selectedResume, extractedResumeData);
    score += contentScore;
    
    // ATS compatibility (15% of score)
    const atsScore = checkATSCompatibility(extractedResumeData);
    score += atsScore;
    
    score = Math.min(Math.round(score), 100);

    // Calculate additional metrics
    const readabilityScore = calculateReadabilityScore(resumeText);
    const keywordDensity = (matchingKeywords.length / resumeText.split(' ').length) * 100;
    const sectionsFound = findSections(selectedResume);
    const missingSections = findMissingSections(sectionsFound);

    const analysisResult: ATSAnalysis = {
      score,
      keywords: matchingKeywords,
      missingKeywords: missingKeywords.slice(0, 15),
      issues: generateAdvancedIssues(selectedResume, extractedResumeData, missingKeywords),
      suggestions: generateAdvancedSuggestions(selectedResume, extractedResumeData, missingKeywords),
      formatIssues: getAdvancedFormatIssues(extractedResumeData),
      strengths: getAdvancedStrengths(selectedResume, extractedResumeData, matchingKeywords),
      readabilityScore,
      keywordDensity,
      sectionsFound,
      missingSections,
      contactInfoComplete: checkContactInfo(extractedResumeData),
      skillsCount: extractedResumeData.skills.length,
      experienceYears: calculateExperienceYears(extractedResumeData.experience),
      educationLevel: getEducationLevel(extractedResumeData.education)
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

  // Advanced keyword extraction with better filtering
  const extractAdvancedKeywords = (text: string): string[] => {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'this', 'that', 'these', 'those', 'who', 'what', 'where', 'when', 'why', 'how'];
    
    // Extract multi-word phrases and single words
    const phrases = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));

    return [...new Set([...phrases, ...words])].slice(0, 100);
  };

  const checkAdvancedFormat = (resume: any, extractedData: ExtractedData): number => {
    let score = 0;
    
    // Contact information completeness (5 points)
    if (extractedData.personalInfo.name && extractedData.personalInfo.email && extractedData.personalInfo.phone) {
      score += 5;
    }
    
    // Skills section (5 points)
    if (extractedData.skills.length >= 5) score += 3;
    if (extractedData.skills.length >= 10) score += 2;
    
    // Experience/Projects (10 points)
    if (extractedData.experience.length > 0 || extractedData.projects.length > 0) score += 5;
    if (extractedData.projects.length >= 2) score += 3;
    if (extractedData.experience.length >= 1) score += 2;
    
    // Education (5 points)
    if (extractedData.education.length > 0 && extractedData.education[0].institution) score += 5;
    
    return score;
  };

  const checkAdvancedContent = (resume: any, extractedData: ExtractedData): number => {
    let score = 0;
    
    // Content depth (10 points)
    const totalContent = extractedData.projects.reduce((acc, p) => acc + p.description.length, 0) +
                         extractedData.experience.reduce((acc, e) => acc + e.description.join(' ').length, 0);
    
    if (totalContent > 500) score += 5;
    if (totalContent > 1000) score += 5;
    
    // Skills variety (10 points)
    if (extractedData.skills.length >= 8) score += 5;
    if (extractedData.skills.length >= 15) score += 5;
    
    // Project technologies (5 points)
    const totalTech = extractedData.projects.reduce((acc, p) => acc + p.technologies.length, 0);
    if (totalTech >= 5) score += 3;
    if (totalTech >= 10) score += 2;
    
    return score;
  };

  const checkATSCompatibility = (extractedData: ExtractedData): number => {
    let score = 0;
    
    // Standard sections (10 points)
    if (extractedData.personalInfo.name) score += 2;
    if (extractedData.skills.length > 0) score += 2;
    if (extractedData.education.length > 0) score += 2;
    if (extractedData.experience.length > 0 || extractedData.projects.length > 0) score += 2;
    if (extractedData.personalInfo.email && extractedData.personalInfo.phone) score += 2;
    
    // Content structure (5 points)
    const hasQuantifiableAchievements = extractedData.projects.some(p => 
      /\d+/.test(p.description) || /%/.test(p.description)
    );
    if (hasQuantifiableAchievements) score += 3;
    
    if (extractedData.skills.length >= 5) score += 2;
    
    return score;
  };

  const calculateReadabilityScore = (text: string): number => {
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / Math.max(sentences, 1);
    
    // Score based on readability (lower sentences = better for ATS)
    if (avgWordsPerSentence <= 15) return 90;
    if (avgWordsPerSentence <= 20) return 75;
    if (avgWordsPerSentence <= 25) return 60;
    return 40;
  };

  const findSections = (resume: any): string[] => {
    const sections = [];
    if (resume.basicInfo.name) sections.push('Contact Information');
    if (resume.skills.length > 0) sections.push('Skills');
    if (resume.projects.length > 0) sections.push('Projects');
    if (resume.education.collegeName) sections.push('Education');
    if (resume.experience && resume.experience.length > 0) sections.push('Experience');
    return sections;
  };

  const findMissingSections = (sectionsFound: string[]): string[] => {
    const requiredSections = ['Contact Information', 'Skills', 'Projects', 'Education'];
    return requiredSections.filter(section => !sectionsFound.includes(section));
  };

  const checkContactInfo = (extractedData: ExtractedData): boolean => {
    return !!(extractedData.personalInfo.name && 
             extractedData.personalInfo.email && 
             extractedData.personalInfo.phone);
  };

  const calculateExperienceYears = (experience: any[]): number => {
    // Simple calculation based on number of experiences
    return experience.length * 1.5; // Assume average 1.5 years per role
  };

  const getEducationLevel = (education: any[]): string => {
    if (education.length === 0) return 'Not specified';
    const degree = education[0].degree?.toLowerCase() || '';
    if (degree.includes('phd') || degree.includes('doctorate')) return 'Doctorate';
    if (degree.includes('master') || degree.includes('mba')) return 'Masters';
    if (degree.includes('bachelor') || degree.includes('bs') || degree.includes('ba')) return 'Bachelors';
    return 'Other';
  };

  const generateAdvancedIssues = (resume: any, extractedData: ExtractedData, missingKeywords: string[]): string[] => {
    const issues = [];
    
    if (missingKeywords.length > 8) {
      issues.push(`Missing ${missingKeywords.length} critical keywords from job description`);
    }
    
    if (!extractedData.personalInfo.phone) {
      issues.push("Missing phone number in contact information");
    }
    
    if (extractedData.skills.length < 8) {
      issues.push("Skills section needs more comprehensive technical skills");
    }
    
    if (extractedData.projects.length < 2) {
      issues.push("Add more projects to demonstrate practical experience");
    }
    
    if (!extractedData.personalInfo.location) {
      issues.push("Consider adding location information");
    }
    
    return issues;
  };

  const generateAdvancedSuggestions = (resume: any, extractedData: ExtractedData, missingKeywords: string[]): string[] => {
    const suggestions = [];
    
    if (missingKeywords.length > 0) {
      suggestions.push(`Incorporate these high-impact keywords: ${missingKeywords.slice(0, 8).join(', ')}`);
    }
    
    suggestions.push("Use action verbs and quantify achievements with specific metrics");
    suggestions.push("Ensure consistent formatting and use standard section headings");
    suggestions.push("Include relevant certifications and technical skills");
    suggestions.push("Tailor your resume content to match job requirements exactly");
    
    if (extractedData.projects.length > 0) {
      suggestions.push("Add more technical details and impact metrics to project descriptions");
    }
    
    return suggestions;
  };

  const getAdvancedFormatIssues = (extractedData: ExtractedData): string[] => {
    const issues = [];
    
    if (!extractedData.personalInfo.name) issues.push("Missing name in header");
    if (!extractedData.personalInfo.email) issues.push("Missing email address");
    if (!extractedData.personalInfo.phone) issues.push("Missing phone number");
    if (extractedData.skills.length === 0) issues.push("No skills section found");
    if (extractedData.education.length === 0) issues.push("Missing education information");
    
    return issues;
  };

  const getAdvancedStrengths = (resume: any, extractedData: ExtractedData, matchingKeywords: string[]): string[] => {
    const strengths = [];
    
    if (matchingKeywords.length > 8) {
      strengths.push(`Excellent keyword alignment with ${matchingKeywords.length} matching terms`);
    }
    
    if (extractedData.skills.length >= 10) {
      strengths.push("Comprehensive technical skills portfolio");
    }
    
    if (extractedData.projects.length >= 3) {
      strengths.push("Strong project portfolio demonstrating hands-on experience");
    }
    
    if (extractedData.personalInfo.name && extractedData.personalInfo.email && extractedData.personalInfo.phone) {
      strengths.push("Complete contact information provided");
    }
    
    if (extractedData.education.length > 0 && extractedData.education[0].gpa) {
      strengths.push("Academic achievements clearly documented");
    }
    
    return strengths;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-foreground">ATS Analyzer</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Advanced resume analysis with keyword matching and ATS optimization
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!analysis}>Analysis</TabsTrigger>
          <TabsTrigger value="keywords" disabled={!analysis}>Keywords</TabsTrigger>
          <TabsTrigger value="details" disabled={!analysis}>Details</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Resume Analysis Setup
              </CardTitle>
              <CardDescription>
                Select a resume and provide the job description for comprehensive ATS analysis
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
                  placeholder="Paste the complete job description including requirements, responsibilities, and preferred qualifications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[250px]"
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
                    <BarChart3 className="h-4 w-4" />
                    Start Comprehensive Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Results Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {analysis && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Overall Score Card */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>ATS Compatibility Score</CardTitle>
                  <CardDescription>Overall resume performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </div>
                    <div className="text-lg text-muted-foreground">/100</div>
                    <div className={`text-base font-medium ${getScoreColor(analysis.score)}`}>
                      {getScoreLevel(analysis.score)}
                    </div>
                  </div>
                  <Progress value={analysis.score} className="w-full" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Readability:</span>
                      <span className="font-medium">{analysis.readabilityScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Keyword Density:</span>
                      <span className="font-medium">{analysis.keywordDensity.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Resume Statistics</CardTitle>
                  <CardDescription>Key metrics extracted from your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{analysis.skillsCount}</div>
                      <div className="text-sm text-muted-foreground">Skills Listed</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{analysis.keywords.length}</div>
                      <div className="text-sm text-muted-foreground">Matched Keywords</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{analysis.sectionsFound.length}</div>
                      <div className="text-sm text-muted-foreground">Sections Found</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{analysis.educationLevel}</div>
                      <div className="text-sm text-muted-foreground">Education Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issues and Suggestions */}
              <div className="lg:col-span-2 space-y-6">
                {analysis.issues.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Critical Issues
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

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Optimization Suggestions
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
              </div>

              {/* Strengths */}
              <div className="lg:col-span-2">
                {analysis.strengths.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Resume Strengths
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
            </div>
          )}
        </TabsContent>

        {/* Keywords Analysis Tab */}
        <TabsContent value="keywords" className="space-y-6">
          {analysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Matched Keywords ({analysis.keywords.length})
                  </CardTitle>
                  <CardDescription>Keywords found in both your resume and job description</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                    {analysis.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    Missing Keywords ({analysis.missingKeywords.length})
                  </CardTitle>
                  <CardDescription>Important keywords from job description not found in resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                    {analysis.missingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Detailed Analysis Tab */}
        <TabsContent value="details" className="space-y-6">
          {extractedData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Resume Data</CardTitle>
                  <CardDescription>Information parsed from your resume</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Personal Information</h4>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <div>Name: {extractedData.personalInfo.name || 'Not found'}</div>
                      <div>Email: {extractedData.personalInfo.email || 'Not found'}</div>
                      <div>Phone: {extractedData.personalInfo.phone || 'Not found'}</div>
                      <div>Location: {extractedData.personalInfo.location || 'Not specified'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Skills ({extractedData.skills.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {extractedData.skills.slice(0, 10).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {extractedData.skills.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{extractedData.skills.length - 10} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Projects ({extractedData.projects.length})</h4>
                    <div className="space-y-2">
                      {extractedData.projects.slice(0, 3).map((project, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-muted-foreground text-xs">
                            {project.technologies.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {analysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Section Analysis</CardTitle>
                    <CardDescription>Resume structure evaluation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Sections Found</h4>
                      <div className="space-y-1">
                        {analysis.sectionsFound.map((section, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {section}
                          </div>
                        ))}
                      </div>
                    </div>

                    {analysis.missingSections.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">Missing Sections</h4>
                        <div className="space-y-1">
                          {analysis.missingSections.map((section, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <XCircle className="h-3 w-3 text-red-500" />
                              {section}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium mb-2">ATS Compatibility Factors</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Contact Info Complete:</span>
                          <span className={analysis.contactInfoComplete ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {analysis.contactInfoComplete ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Readability Score:</span>
                          <span className="font-medium">{analysis.readabilityScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Keyword Density:</span>
                          <span className="font-medium">{analysis.keywordDensity.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
