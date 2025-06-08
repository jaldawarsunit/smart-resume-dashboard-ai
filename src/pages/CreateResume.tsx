
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useResumes } from "@/hooks/useResumes";
import { useNavigate } from "react-router-dom";
import { PlusCircle, X, Save } from "lucide-react";

export default function CreateResume() {
  const [title, setTitle] = useState('');
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [skills, setSkills] = useState<string[]>(['']);
  const [targetJobRole, setTargetJobRole] = useState('');
  const [projects, setProjects] = useState([{
    title: '',
    description: '',
    technologies: ['']
  }]);
  const [certifications, setCertifications] = useState<string[]>(['']);
  const [education, setEducation] = useState({
    tenthMarks: '',
    twelfthMarks: '',
    collegeName: '',
    cgpa: ''
  });

  const { saveResume } = useResumes();
  const { toast } = useToast();
  const navigate = useNavigate();

  const addSkill = () => setSkills([...skills, '']);
  const removeSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index));
  const updateSkill = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addProject = () => setProjects([...projects, { title: '', description: '', technologies: [''] }]);
  const removeProject = (index: number) => setProjects(projects.filter((_, i) => i !== index));

  const addTechnology = (projectIndex: number) => {
    const newProjects = [...projects];
    newProjects[projectIndex].technologies.push('');
    setProjects(newProjects);
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const newProjects = [...projects];
    newProjects[projectIndex].technologies = newProjects[projectIndex].technologies.filter((_, i) => i !== techIndex);
    setProjects(newProjects);
  };

  const updateProject = (index: number, field: string, value: string) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  const updateTechnology = (projectIndex: number, techIndex: number, value: string) => {
    const newProjects = [...projects];
    newProjects[projectIndex].technologies[techIndex] = value;
    setProjects(newProjects);
  };

  const addCertification = () => setCertifications([...certifications, '']);
  const removeCertification = (index: number) => setCertifications(certifications.filter((_, i) => i !== index));
  const updateCertification = (index: number, value: string) => {
    const newCertifications = [...certifications];
    newCertifications[index] = value;
    setCertifications(newCertifications);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your resume.",
        variant: "destructive",
      });
      return;
    }

    if (!basicInfo.name.trim() || !basicInfo.email.trim()) {
      toast({
        title: "Basic information required",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      });
      return;
    }

    const resumeData = {
      title: title.trim(),
      basicInfo: {
        name: basicInfo.name.trim(),
        email: basicInfo.email.trim(),
        phone: basicInfo.phone.trim()
      },
      skills: skills.filter(skill => skill.trim()),
      targetJobRole: targetJobRole.trim(),
      projects: projects.map(project => ({
        title: project.title.trim(),
        description: project.description.trim(),
        technologies: project.technologies.filter(tech => tech.trim())
      })).filter(project => project.title),
      certifications: certifications.filter(cert => cert.trim()),
      education: {
        tenthMarks: education.tenthMarks.trim(),
        twelfthMarks: education.twelfthMarks.trim(),
        collegeName: education.collegeName.trim(),
        cgpa: education.cgpa.trim()
      }
    };

    const newResume = saveResume(resumeData);
    
    if (newResume) {
      toast({
        title: "Resume created successfully!",
        description: "Your resume has been saved and is ready to use.",
      });
      navigate('/resumes');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Create Professional Resume</h1>
        <p className="text-lg text-gray-600 mt-3">Build a resume that gets you noticed by employers and ATS systems.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Resume Title */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Resume Information</CardTitle>
            <CardDescription>Give your resume a descriptive title</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="title">Resume Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Software Developer Resume - 2024"
                required
                className="text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>Your contact details and basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={basicInfo.email}
                  onChange={(e) => setBasicInfo({...basicInfo, email: e.target.value})}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={basicInfo.phone}
                onChange={(e) => setBasicInfo({...basicInfo, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </CardContent>
        </Card>

        {/* Target Job Role */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Career Objective</CardTitle>
            <CardDescription>What position are you targeting?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Job Role</Label>
              <Input
                id="targetRole"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                placeholder="e.g., Full Stack Developer, Data Scientist, Product Manager"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Professional Skills</CardTitle>
            <CardDescription>List your technical and professional competencies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  placeholder="Enter a skill (e.g., JavaScript, Project Management)"
                  className="flex-1"
                />
                {skills.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeSkill(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSkill} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Another Skill
            </Button>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Projects & Experience</CardTitle>
            <CardDescription>Showcase your key projects and achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.map((project, projectIndex) => (
              <div key={projectIndex} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">Project {projectIndex + 1}</h4>
                  {projects.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeProject(projectIndex)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`project-title-${projectIndex}`}>Project Title</Label>
                    <Input
                      id={`project-title-${projectIndex}`}
                      value={project.title}
                      onChange={(e) => updateProject(projectIndex, 'title', e.target.value)}
                      placeholder="e.g., E-commerce Website, Mobile App"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`project-description-${projectIndex}`}>Description</Label>
                    <Textarea
                      id={`project-description-${projectIndex}`}
                      value={project.description}
                      onChange={(e) => updateProject(projectIndex, 'description', e.target.value)}
                      placeholder="Describe what you built, your role, and the impact..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Technologies Used</Label>
                    {project.technologies.map((tech, techIndex) => (
                      <div key={techIndex} className="flex gap-2">
                        <Input
                          value={tech}
                          onChange={(e) => updateTechnology(projectIndex, techIndex, e.target.value)}
                          placeholder="e.g., React, Node.js, MongoDB"
                          className="flex-1"
                        />
                        {project.technologies.length > 1 && (
                          <Button type="button" variant="outline" size="icon" onClick={() => removeTechnology(projectIndex, techIndex)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addTechnology(projectIndex)} className="gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Add Technology
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addProject} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Another Project
            </Button>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Educational Background</CardTitle>
            <CardDescription>Your academic qualifications and achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="collegeName">College/University Name</Label>
                <Input
                  id="collegeName"
                  value={education.collegeName}
                  onChange={(e) => setEducation({...education, collegeName: e.target.value})}
                  placeholder="Enter your institution name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA/Percentage</Label>
                <Input
                  id="cgpa"
                  value={education.cgpa}
                  onChange={(e) => setEducation({...education, cgpa: e.target.value})}
                  placeholder="e.g., 8.5 CGPA or 85%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twelfthMarks">12th Grade Results</Label>
                <Input
                  id="twelfthMarks"
                  value={education.twelfthMarks}
                  onChange={(e) => setEducation({...education, twelfthMarks: e.target.value})}
                  placeholder="e.g., 85% or A Grade"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenthMarks">10th Grade Results</Label>
                <Input
                  id="tenthMarks"
                  value={education.tenthMarks}
                  onChange={(e) => setEducation({...education, tenthMarks: e.target.value})}
                  placeholder="e.g., 90% or A+ Grade"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Certifications & Achievements</CardTitle>
            <CardDescription>Professional certifications and notable achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  value={cert}
                  onChange={(e) => updateCertification(index, e.target.value)}
                  placeholder="e.g., AWS Certified Developer, Google Analytics Certified"
                  className="flex-1"
                />
                {certifications.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeCertification(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addCertification} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Certification
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-6 pt-6">
          <Button type="button" variant="outline" size="lg" onClick={() => navigate('/resumes')}>
            Cancel
          </Button>
          <Button type="submit" size="lg" className="gap-2">
            <Save className="h-5 w-5" />
            Create Resume
          </Button>
        </div>
      </form>
    </div>
  );
}
