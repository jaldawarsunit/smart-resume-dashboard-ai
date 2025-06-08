
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResumes } from "@/hooks/useResumes";
import { useNavigate } from "react-router-dom";
import { Resume } from "@/types/resume";

interface ExtractedData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  targetRole: string;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  certifications: string[];
  education: {
    tenthMarks: string;
    twelfthMarks: string;
    collegeName: string;
    cgpa: string;
  };
}

export default function UploadResume() {
  const { toast } = useToast();
  const { saveResume } = useResumes();
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        // For actual PDF parsing, you'd need a library like pdf-parse or pdf.js
        // For now, we'll simulate extraction
        const content = `
          John Doe
          Software Engineer
          john.doe@email.com
          +1-234-567-8900
          
          Skills: JavaScript, React, Node.js, Python, SQL, MongoDB, AWS
          
          Experience:
          - Developed full-stack web applications using React and Node.js
          - Built RESTful APIs and microservices
          - Implemented CI/CD pipelines
          
          Projects:
          E-commerce Platform: Built a complete e-commerce solution with React, Node.js, and MongoDB
          Task Management App: Created a collaborative task management application
          
          Education:
          Bachelor of Computer Science
          University of Technology
          CGPA: 8.5/10
          
          Certifications:
          AWS Certified Developer
          Google Cloud Professional
        `;
        resolve(content);
      };
      reader.readAsText(file);
    });
  };

  const parseExtractedText = (text: string): ExtractedData => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Basic parsing logic (this would be more sophisticated in a real implementation)
    const data: ExtractedData = {
      name: '',
      email: '',
      phone: '',
      skills: [],
      targetRole: '',
      projects: [],
      certifications: [],
      education: {
        tenthMarks: '',
        twelfthMarks: '',
        collegeName: '',
        cgpa: ''
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      // Extract name (usually first non-empty line)
      if (!data.name && lines[i] && !line.includes('@') && !line.includes('+')) {
        data.name = lines[i];
      }
      
      // Extract email
      if (line.includes('@')) {
        data.email = lines[i];
      }
      
      // Extract phone
      if (line.includes('+') || /\d{3}-\d{3}-\d{4}/.test(line)) {
        data.phone = lines[i];
      }
      
      // Extract skills
      if (line.includes('skills:')) {
        const skillsText = lines[i].split(':')[1];
        data.skills = skillsText.split(',').map(skill => skill.trim());
      }
      
      // Extract target role
      if (line.includes('engineer') || line.includes('developer') || line.includes('manager')) {
        data.targetRole = lines[i];
      }
      
      // Extract education
      if (line.includes('university') || line.includes('college')) {
        data.education.collegeName = lines[i];
      }
      
      if (line.includes('cgpa:') || line.includes('gpa:')) {
        const gpaMatch = lines[i].match(/(\d+\.?\d*)/);
        if (gpaMatch) {
          data.education.cgpa = gpaMatch[1];
        }
      }
      
      // Extract certifications
      if (line.includes('certified') || line.includes('certification')) {
        data.certifications.push(lines[i]);
      }
    }

    // Extract projects (basic implementation)
    const projectSection = text.toLowerCase().indexOf('projects:');
    if (projectSection !== -1) {
      const projectText = text.substring(projectSection);
      const projectLines = projectText.split('\n').slice(1, 4); // Get first few project lines
      
      projectLines.forEach(line => {
        if (line.trim() && line.includes(':')) {
          const [title, description] = line.split(':');
          data.projects.push({
            title: title.trim(),
            description: description.trim(),
            technologies: ['React', 'Node.js'] // Basic extraction
          });
        }
      });
    }

    return data;
  };

  const handleFile = async (file: File) => {
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
    setIsProcessing(true);
    
    try {
      // Extract text from file
      const extractedText = await extractTextFromPDF(file);
      
      // Parse the extracted text
      const parsedData = parseExtractedText(extractedText);
      
      setExtractedData(parsedData);
      
      toast({
        title: "Resume processed successfully!",
        description: "Your resume data has been extracted and is ready for editing.",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const saveExtractedData = () => {
    if (!extractedData) return;

    const resumeData = {
      title: `${extractedData.name}'s Resume`,
      basicInfo: {
        name: extractedData.name,
        email: extractedData.email,
        phone: extractedData.phone,
      },
      skills: extractedData.skills,
      targetJobRole: extractedData.targetRole,
      projects: extractedData.projects,
      certifications: extractedData.certifications,
      education: {
        tenthMarks: extractedData.education.tenthMarks,
        twelfthMarks: extractedData.education.twelfthMarks,
        collegeName: extractedData.education.collegeName,
        cgpa: extractedData.education.cgpa,
      },
    };

    const savedResume = saveResume(resumeData);
    
    if (savedResume) {
      toast({
        title: "Resume saved!",
        description: "Your uploaded resume has been saved to your account.",
      });
      navigate('/resumes');
    }
  };

  const editInformation = () => {
    if (!extractedData) return;
    
    // Store extracted data in localStorage for the create page
    localStorage.setItem('uploadedResumeData', JSON.stringify(extractedData));
    navigate('/create');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Upload Resume</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Upload your existing resume and let our AI extract the information</p>
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
                dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Drop your resume here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                {isProcessing ? (
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                ) : extractedData ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                )}
              </div>
              
              {isProcessing && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
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

                {extractedData.projects.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Projects</h3>
                    {extractedData.projects.map((project: any, index: number) => (
                      <div key={index} className="border rounded p-3 text-sm">
                        <p><strong>{project.title}</strong></p>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Tech: {project.technologies.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button onClick={saveExtractedData} className="flex-1">
                    Save as New Resume
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={editInformation}>
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
