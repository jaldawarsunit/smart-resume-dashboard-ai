
import React from 'react';
import { Resume } from '@/types/resume';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{resume.basicInfo.name}</h1>
          <div className="flex justify-center items-center gap-4 text-gray-600">
            <span>{resume.basicInfo.email}</span>
            <span>•</span>
            <span>{resume.basicInfo.phone}</span>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Target Job Role */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Target Role</h2>
          <p className="text-lg text-primary font-medium">{resume.targetJobRole}</p>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Projects */}
        {resume.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Projects</h2>
            <div className="space-y-4">
              {resume.projects.map((project, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Education</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">College:</span>
              <span>{resume.education.collegeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">CGPA:</span>
              <span>{resume.education.cgpa}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">12th Marks:</span>
              <span>{resume.education.twelfthMarks}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">10th Marks:</span>
              <span>{resume.education.tenthMarks}</span>
            </div>
          </div>
        </div>

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Certifications</h2>
            <ul className="list-disc list-inside space-y-1">
              {resume.certifications.map((cert, index) => (
                <li key={index} className="text-gray-700">{cert}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ATS Score */}
        {resume.atsScore && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">ATS Score</h3>
            <div className="text-3xl font-bold text-primary">{resume.atsScore}/100</div>
          </div>
        )}
      </div>
    </div>
  );
}
