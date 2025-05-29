
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Edit, Trash2, Eye } from "lucide-react";
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

  const handleDelete = (id: string) => {
    deleteResume(id);
    toast({
      title: "Resume deleted",
      description: "Your resume has been deleted successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600 mt-2">Manage and view all your resumes in one place.</p>
        </div>
        <Button asChild>
          <Link to="/create" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Resume
          </Link>
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Create your first resume to get started.</p>
            <Button asChild>
              <Link to="/create" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Your First Resume
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {resume.title}
                </CardTitle>
                <CardDescription>
                  Created: {formatDate(resume.createdAt)}
                  <br />
                  Updated: {formatDate(resume.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Target Role:</p>
                    <p className="font-medium text-primary">{resume.targetJobRole}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Skills:</p>
                    <p className="text-sm">{resume.skills.slice(0, 3).join(', ')}{resume.skills.length > 3 ? '...' : ''}</p>
                  </div>

                  {resume.atsScore && (
                    <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
                      <span className="text-sm font-medium">ATS Score:</span>
                      <span className="text-lg font-bold text-primary">{resume.atsScore}/100</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewResume(resume)}
                      className="flex-1 gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(resume.id)}
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resume Preview Dialog */}
      <Dialog open={!!previewResume} onOpenChange={() => setPreviewResume(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Preview - {previewResume?.title}</DialogTitle>
          </DialogHeader>
          {previewResume && <ResumePreview resume={previewResume} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
