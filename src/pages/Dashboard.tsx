
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Upload, BarChart3, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useResumes } from "@/hooks/useResumes";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { resumes } = useResumes();
  const { user } = useAuth();

  const totalResumes = resumes.length;
  const avgAtsScore = resumes.length > 0 
    ? Math.round(resumes.reduce((sum, resume) => sum + (resume.atsScore || 0), 0) / resumes.length)
    : 0;

  const stats = [
    { title: "Total Resumes", value: totalResumes.toString(), icon: FileText },
    { title: "ATS Avg Score", value: avgAtsScore > 0 ? `${avgAtsScore}%` : "N/A", icon: BarChart3 },
    { title: "Recent Activity", value: resumes.length > 0 ? "Active" : "None", icon: TrendingUp },
  ];

  const recentResumes = resumes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-lg text-gray-600 mt-2">Create professional resumes that stand out to employers.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-base">Start building your professional resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button asChild className="h-24 flex-col gap-3 text-base" size="lg">
              <Link to="/create">
                <PlusCircle className="h-8 w-8" />
                Create New Resume
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex-col gap-3 text-base" size="lg">
              <Link to="/upload">
                <Upload className="h-8 w-8" />
                Upload Resume
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex-col gap-3 text-base" size="lg">
              <Link to="/ats">
                <BarChart3 className="h-8 w-8" />
                ATS Analysis
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Resumes */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Recent Resumes</CardTitle>
          <CardDescription className="text-base">Your recently modified resumes</CardDescription>
        </CardHeader>
        <CardContent>
          {recentResumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No resumes yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first professional resume</p>
              <Button asChild size="lg">
                <Link to="/create">Create Your First Resume</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentResumes.map((resume) => (
                <div key={resume.id} className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{resume.title}</h3>
                      <p className="text-gray-500">Modified {formatDate(resume.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">ATS Score</p>
                      <p className={`text-lg font-bold ${resume.atsScore && resume.atsScore >= 80 ? 'text-green-600' : resume.atsScore && resume.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {resume.atsScore ? `${resume.atsScore}%` : 'Not analyzed'}
                      </p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link to="/resumes">View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
