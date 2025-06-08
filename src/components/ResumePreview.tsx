
import React from 'react';
import { Resume } from '@/types/resume';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl border">
      <div className="p-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{resume.basicInfo.name}</h1>
          <div className="flex justify-center items-center gap-6 text-gray-700 text-lg">
            <span>{resume.basicInfo.email}</span>
            <span className="text-gray-400">|</span>
            <span>{resume.basicInfo.phone}</span>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Professional Summary / Target Role */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-primary pb-2">
            Professional Summary
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Seeking a position as <span className="font-semibold text-primary">{resume.targetJobRole}</span> where I can leverage my skills and experience to contribute to organizational success.
          </p>
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-primary pb-2">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {resume.skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <span className="text-gray-700 font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        {resume.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-primary pb-2">
              Key Projects
            </h2>
            <div className="space-y-6">
              {resume.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-700 mb-3 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-600 mr-2">Technologies:</span>
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-primary pb-2">
            Education
          </h2>
          <div className="space-y-4">
            {resume.education.collegeName && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{resume.education.collegeName}</h3>
                {resume.education.cgpa && (
                  <p className="text-gray-700">CGPA: <span className="font-medium">{resume.education.cgpa}</span></p>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {resume.education.twelfthMarks && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">Higher Secondary Education</p>
                  <p className="text-gray-700">Marks: {resume.education.twelfthMarks}</p>
                </div>
              )}
              {resume.education.tenthMarks && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">Secondary Education</p>
                  <p className="text-gray-700">Marks: {resume.education.tenthMarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certifications Section */}
        {resume.certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-primary pb-2">
              Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resume.certifications.map((cert, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span className="text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATS Score */}
        {resume.atsScore && (
          <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">ATS Compatibility Score</h3>
                <p className="text-gray-600">Applicant Tracking System Optimization</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">{resume.atsScore}/100</div>
                <p className={`text-sm font-medium ${resume.atsScore >= 80 ? 'text-green-600' : resume.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {resume.atsScore >= 80 ? 'Excellent' : resume.atsScore >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
