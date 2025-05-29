
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UploadResume() {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    
    // Simulate AI extraction process
    setTimeout(() => {
      setExtractedData({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
        targetRole: "Full Stack Developer",
        projects: [
          {
            title: "E-commerce Platform",
            description: "Built a full-stack e-commerce platform with user authentication, payment processing, and admin dashboard.",
            technologies: "React, Node.js, MongoDB, Stripe"
          }
        ],
        certifications: ["AWS Certified Developer", "Google Cloud Professional"],
        education: {
          tenth: "85",
          twelfth: "88",
          college: "University of Technology",
          cgpa: "8.5"
        }
      });
      
      toast({
        title: "Resume processed successfully!",
        description: "Your resume data has been extracted and is ready for editing.",
      });
    }, 2000);
  };

  const saveExtractedData = () => {
    toast({
      title: "Resume saved!",
      description: "Your uploaded resume has been saved to your account.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Resume</h1>
        <p className="text-gray-600 mt-2">Upload your existing resume and let our AI extract the information</p>
      </div>

      {!uploadedFile ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>
              Drag and drop your resume file or click to browse. Supported formats: PDF, DOC, DOCX
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your resume here, or click to select
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Maximum file size: 10MB
              </p>
              <input
                type="file"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="resume-upload"
              />
              <Button asChild>
                <label htmlFor="resume-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Uploaded File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {extractedData ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-600 animate-pulse" />
                )}
              </div>
              
              {!extractedData && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    🤖 AI is processing your resume... This may take a few moments.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {extractedData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Extracted Information
                </CardTitle>
                <CardDescription>
                  Review the extracted information and edit if needed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Name:</strong> {extractedData.name}</p>
                    <p><strong>Email:</strong> {extractedData.email}</p>
                    <p><strong>Phone:</strong> {extractedData.phone}</p>
                    <p><strong>Target Role:</strong> {extractedData.targetRole}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {extractedData.skills.map((skill: string) => (
                      <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Projects</h3>
                  {extractedData.projects.map((project: any, index: number) => (
                    <div key={index} className="border rounded p-3 text-sm">
                      <p><strong>{project.title}</strong></p>
                      <p className="text-gray-600 mt-1">{project.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Tech: {project.technologies}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button onClick={saveExtractedData} className="flex-1">
                    Save as New Resume
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Edit Information
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
