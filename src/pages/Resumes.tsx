
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MoreVertical, Edit, Trash2, Eye, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Resumes() {
  const [resumes] = useState([
    {
      id: 1,
      title: "Frontend Developer Resume",
      targetRole: "Frontend Developer",
      lastModified: "2 hours ago",
      atsScore: 85,
      status: "complete"
    },
    {
      id: 2,
      title: "Full Stack Developer Resume",
      targetRole: "Full Stack Developer",
      lastModified: "1 day ago",
      atsScore: 72,
      status: "complete"
    },
    {
      id: 3,
      title: "Data Scientist Resume",
      targetRole: "Data Scientist",
      lastModified: "3 days ago",
      atsScore: 89,
      status: "complete"
    },
    {
      id: 4,
      title: "Backend Developer Resume",
      targetRole: "Backend Developer",
      lastModified: "1 week ago",
      atsScore: 0,
      status: "draft"
    },
  ]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600 mt-2">Manage all your resumes in one place</p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Create New Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <Card key={resume.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{resume.title}</CardTitle>
                  <CardDescription className="mt-1">{resume.targetRole}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem className="gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Badge variant={resume.status === "complete" ? "default" : "secondary"}>
                    {resume.status}
                  </Badge>
                  {resume.atsScore > 0 && (
                    <Badge variant="outline" className={getScoreColor(resume.atsScore)}>
                      ATS: {resume.atsScore}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">Modified {resume.lastModified}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
