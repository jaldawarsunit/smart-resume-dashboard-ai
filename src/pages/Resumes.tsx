
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Edit, Trash2, Eye, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useResumes } from "@/hooks/useResumes";
import { useToast } from "@/hooks/use-toast";
import { ResumePreview } from "@/components/ResumePreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Resume } from "@/types/resume";

export default function Resumes() {
  const { resumes, isLoading, deleteResume } = useResumes();
  const { toast } = useToast();
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteResume(id);
      toast({
        title: "Resume deleted",
        description: "Your resume has been permanently deleted.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-lg text-gray-600 mt-2">Manage and optimize your professional resumes.</p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link to="/create">
            <PlusCircle className="h-5 w-5" />
            Create New Resume
          </Link>
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card className="text-center py-16 shadow-lg">
          <CardContent>
            <FileText className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No resumes created yet</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Start building your professional resume to land your dream job.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/create">
                <PlusCircle className="h-5 w-5" />
                Create Your First Resume
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <FileText className="h-6 w-6 text-primary" />
                      {resume.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <span className="font-medium">Target Role:</span>
                          <p className="text-primary font-semibold">{resume.targetJobRole}</p>
                        </div>
                        <div>
                          <span className="font-medium">Last Updated:</span>
                          <p>{formatDate(resume.updatedAt)}</p>
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                  
                  {resume.atsScore && (
                    <div className="text-right bg-primary/10 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">ATS Score</p>
                      <p className={`text-2xl font-bold ${resume.atsScore >= 80 ? 'text-green-600' : resume.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {resume.atsScore}/100
                      </p>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Skills ({resume.skills.length}):</p>
                    <p className="text-sm text-gray-600">
                      {resume.skills.slice(0, 4).join(', ')}
                      {resume.skills.length > 4 ? ` +${resume.skills.length - 4} more` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Projects:</p>
                    <p className="text-sm text-gray-600">
                      {resume.projects.length > 0 ? `${resume.projects.length} project(s)` : 'No projects added'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setPreviewResume(resume)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(resume.id, resume.title)}
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resume Preview Dialog */}
      <Dialog open={!!previewResume} onOpenChange={() => setPreviewResume(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Resume Preview - {previewResume?.title}</DialogTitle>
          </DialogHeader>
          {previewResume && (
            <div className="mt-4">
              <ResumePreview resume={previewResume} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
