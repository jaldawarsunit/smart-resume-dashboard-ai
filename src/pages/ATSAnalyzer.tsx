
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, FileText, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ATSAnalyzer() {
  const { toast } = useToast();
  const [selectedResume, setSelectedResume] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const resumes = [
    { id: "1", title: "Frontend Developer Resume", targetRole: "Frontend Developer" },
    { id: "2", title: "Full Stack Developer Resume", targetRole: "Full Stack Developer" },
    { id: "3", title: "Data Scientist Resume", targetRole: "Data Scientist" },
  ];

  const analyzeResume = () => {
    if (!selectedResume) {
      toast({
        title: "Please select a resume",
        description: "Choose a resume to analyze for ATS compatibility.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        overallScore: 78,
        breakdown: {
          keywords: { score: 85, status: "good" },
          formatting: { score: 75, status: "fair" },
          experience: { score: 90, status: "excellent" },
          education: { score: 70, status: "fair" },
          skills: { score: 88, status: "good" }
        },
        suggestions: [
          "Add more industry-specific keywords related to your target role",
          "Improve formatting consistency throughout the document",
          "Include quantifiable achievements in your experience section",
          "Add relevant certifications to boost your education score"
        ],
        matchedKeywords: [
          "JavaScript", "React", "Node.js", "Git", "Agile", "API", "Database"
        ],
        missingKeywords: [
          "TypeScript", "AWS", "Docker", "Testing", "CI/CD"
        ]
      });
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete!",
        description: "Your resume has been analyzed for ATS compatibility.",
      });
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "good":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "fair":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ATS Analyzer</h1>
        <p className="text-gray-600 mt-2">Check how well your resume performs against Applicant Tracking Systems</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resume Analysis
          </CardTitle>
          <CardDescription>
            Select a resume to analyze its ATS compatibility and get improvement suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedResume} onValueChange={setSelectedResume}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a resume to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{resume.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={analyzeResume} 
              disabled={!selectedResume || isAnalyzing}
              className="gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm mb-2">
                🤖 AI is analyzing your resume for ATS compatibility...
              </p>
              <Progress value={33} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle>Overall ATS Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}%
                  </div>
                  <p className="text-sm text-gray-500">ATS Compatibility</p>
                </div>
                <div className="flex-1">
                  <Progress value={analysis.overallScore} className="w-full" />
                  <p className="text-sm text-gray-600 mt-2">
                    {analysis.overallScore >= 80 ? "Excellent! Your resume is highly ATS-friendly." :
                     analysis.overallScore >= 60 ? "Good! Some improvements could boost your score." :
                     "Needs improvement. Consider the suggestions below."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analysis.breakdown).map(([category, data]: [string, any]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(data.status)}
                      <span className="font-medium capitalize">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={data.score} className="w-24" />
                      <span className={`font-semibold ${getScoreColor(data.score)}`}>
                        {data.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Keywords Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Matched Keywords</CardTitle>
                <CardDescription>Keywords found in your resume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords.map((keyword: string) => (
                    <Badge key={keyword} variant="outline" className="text-green-600 border-green-600">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Missing Keywords</CardTitle>
                <CardDescription>Consider adding these keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((keyword: string) => (
                    <Badge key={keyword} variant="outline" className="text-red-600 border-red-600">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
