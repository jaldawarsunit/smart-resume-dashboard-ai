import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ResumePreview } from "@/components/ResumePreview";
import { useToast } from "@/hooks/use-toast";
import { useResumes } from "@/hooks/useResumes";
import { useNavigate } from "react-router-dom";
import { Resume } from "@/types/resume";
import { Plus, X, Save, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResumeData {
  title: string;
  basicInfo: {
    name: string;
    email: string;
    phone: string;
  };
  skills: string[];
  targetJobRole: string;
  projects: {
    title: string;
    description: string;
    technologies: string[];
  }[];
  certifications: string[];
  education: {
    tenthMarks: string;
    twelfthMarks: string;
    collegeName: string;
    cgpa: string;
  };
}

export default function CreateResume() {
  const { toast } = useToast();
  const { saveResume } = useResumes();
  const navigate = useNavigate();
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    title: "",
    basicInfo: {
      name: "",
      email: "",
      phone: "",
    },
    skills: [],
    targetJobRole: "",
    projects: [],
    certifications: [],
    education: {
      tenthMarks: "",
      twelfthMarks: "",
      collegeName: "",
      cgpa: "",
    },
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentCertification, setCurrentCertification] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: [] as string[],
  });
  const [currentTech, setCurrentTech] = useState("");

  // Load data from upload if available
  useEffect(() => {
    const uploadedData = localStorage.getItem('uploadedResumeData');
    if (uploadedData) {
      try {
        const parsed = JSON.parse(uploadedData);
        setResumeData({
          title: `${parsed.name}'s Resume`,
          basicInfo: {
            name: parsed.name || "",
            email: parsed.email || "",
            phone: parsed.phone || "",
          },
          skills: parsed.skills || [],
          targetJobRole: parsed.targetRole || "",
          projects: parsed.projects || [],
          certifications: parsed.certifications || [],
          education: {
            tenthMarks: parsed.education?.tenthMarks || "",
            twelfthMarks: parsed.education?.twelfthMarks || "",
            collegeName: parsed.education?.collegeName || "",
            cgpa: parsed.education?.cgpa || "",
          },
        });
        localStorage.removeItem('uploadedResumeData');
        toast({
          title: "Data loaded!",
          description: "Your uploaded resume data has been loaded for editing.",
        });
      } catch (error) {
        console.error("Error loading uploaded data:", error);
      }
    }
  }, [toast]);

  const addSkill = () => {
    if (currentSkill.trim() && !resumeData.skills.includes(currentSkill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertification = () => {
    if (currentCertification.trim() && !resumeData.certifications.includes(currentCertification.trim())) {
      setResumeData(prev => ({
        ...prev,
        certifications: [...prev.certifications, currentCertification.trim()]
      }));
      setCurrentCertification("");
    }
  };

  const removeCertification = (certToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const addTechnology = () => {
    if (currentTech.trim() && !newProject.technologies.includes(currentTech.trim())) {
      setNewProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, currentTech.trim()]
      }));
      setCurrentTech("");
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setNewProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      setResumeData(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));
      setNewProject({
        title: "",
        description: "",
        technologies: [],
      });
    }
  };

  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!resumeData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for your resume.",
        variant: "destructive",
      });
      return;
    }

    if (!resumeData.basicInfo.name.trim()) {
      toast({
        title: "Missing Name",
        description: "Please provide your name.",
        variant: "destructive",
      });
      return;
    }

    const savedResume = saveResume(resumeData);
    
    if (savedResume) {
      toast({
        title: "Resume saved!",
        description: "Your resume has been saved successfully.",
      });
      navigate('/resumes');
    }
  };

  const previewResume: Resume = {
    id: "preview",
    userId: "preview",
    ...resumeData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Resume</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Build your professional resume step by step</p>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Edit Resume
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Title</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={resumeData.title}
                    onChange={(e) => setResumeData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., John Doe - Software Engineer Resume"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={resumeData.basicInfo.name}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, name: e.target.value }
                    }))}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.basicInfo.email}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, email: e.target.value }
                    }))}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.basicInfo.phone}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, phone: e.target.value }
                    }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="targetRole">Target Job Role</Label>
                  <Input
                    id="targetRole"
                    value={resumeData.targetJobRole}
                    onChange={(e) => setResumeData(prev => ({ ...prev, targetJobRole: e.target.value }))}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Enter a skill"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Existing Projects */}
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{project.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}

                <Separator />

                {/* Add New Project */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Add New Project</h4>
                  <div>
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="My Awesome Project"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectDescription">Description</Label>
                    <Textarea
                      id="projectDescription"
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your project and your role..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Technologies Used</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={currentTech}
                        onChange={(e) => setCurrentTech(e.target.value)}
                        placeholder="Technology name"
                        onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                      />
                      <Button onClick={addTechnology} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newProject.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tech}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTechnology(tech)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button onClick={addProject}>Add Project</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="collegeName">College/University</Label>
                  <Input
                    id="collegeName"
                    value={resumeData.education.collegeName}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      education: { ...prev.education, collegeName: e.target.value }
                    }))}
                    placeholder="University of Technology"
                  />
                </div>
                <div>
                  <Label htmlFor="cgpa">CGPA/GPA</Label>
                  <Input
                    id="cgpa"
                    value={resumeData.education.cgpa}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      education: { ...prev.education, cgpa: e.target.value }
                    }))}
                    placeholder="8.5"
                  />
                </div>
                <div>
                  <Label htmlFor="twelfthMarks">12th Grade Marks</Label>
                  <Input
                    id="twelfthMarks"
                    value={resumeData.education.twelfthMarks}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      education: { ...prev.education, twelfthMarks: e.target.value }
                    }))}
                    placeholder="85%"
                  />
                </div>
                <div>
                  <Label htmlFor="tenthMarks">10th Grade Marks</Label>
                  <Input
                    id="tenthMarks"
                    value={resumeData.education.tenthMarks}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      education: { ...prev.education, tenthMarks: e.target.value }
                    }))}
                    placeholder="90%"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={currentCertification}
                    onChange={(e) => setCurrentCertification(e.target.value)}
                    placeholder="Enter a certification"
                    onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                  />
                  <Button onClick={addCertification} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {cert}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeCertification(cert)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Resume
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <ResumePreview resume={previewResume} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
