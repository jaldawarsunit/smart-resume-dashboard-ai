
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useResumes } from "@/hooks/useResumes";
import { useNavigate } from "react-router-dom";
import { PlusCircle, X } from "lucide-react";

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

  const addCertification = () => setCertifications([...certifications, '']);
  const removeCertification = (index: number) => setCertifications(certifications.filter((_, i) => i !== index));

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

    const resumeData = {
      title,
      basicInfo,
      skills: skills.filter(skill => skill.trim()),
      targetJobRole,
      projects: projects.map(project => ({
        ...project,
        technologies: project.technologies.filter(tech => tech.trim())
      })).filter(project => project.title.trim()),
      certifications: certifications.filter(cert => cert.trim()),
      education
    };

    const newResume = saveResume(resumeData);
    
    if (newResume) {
      toast({
        title: "Resume created!",
        description: "Your resume has been saved successfully.",
      });
      navigate('/resumes');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Resume</h1>
        <p className="text-gray-600 mt-2">Fill in your information to create a professional resume.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resume Title */}
        <Card>
          <CardHeader>
            <CardTitle>Resume Title</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Frontend Developer Resume"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Target Job Role */}
        <Card>
          <CardHeader>
            <CardTitle>Target Job Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="targetRole">Job Role</Label>
              <Input
                id="targetRole"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                placeholder="e.g., Frontend Developer, Data Scientist"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  placeholder="Enter a skill"
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
              Add Skill
            </Button>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collegeName">College Name</Label>
                <Input
                  id="collegeName"
                  value={education.collegeName}
                  onChange={(e) => setEducation({...education, collegeName: e.target.value})}
                  placeholder="Your college name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA</Label>
                <Input
                  id="cgpa"
                  value={education.cgpa}
                  onChange={(e) => setEducation({...education, cgpa: e.target.value})}
                  placeholder="e.g., 8.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twelfthMarks">12th Grade Marks</Label>
                <Input
                  id="twelfthMarks"
                  value={education.twelfthMarks}
                  onChange={(e) => setEducation({...education, twelfthMarks: e.target.value})}
                  placeholder="e.g., 85%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenthMarks">10th Grade Marks</Label>
                <Input
                  id="tenthMarks"
                  value={education.tenthMarks}
                  onChange={(e) => setEducation({...education, tenthMarks: e.target.value})}
                  placeholder="e.g., 90%"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/resumes')}>
            Cancel
          </Button>
          <Button type="submit">
            Create Resume
          </Button>
        </div>
      </form>
    </div>
  );
}
