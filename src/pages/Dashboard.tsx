
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
    { title: "Total Resumes", value: totalResumes.toString(), icon: FileText, change: "+2" },
    { title: "ATS Avg Score", value: `${avgAtsScore}%`, icon: BarChart3, change: "+5%" },
    { title: "Applications", value: "12", icon: TrendingUp, change: "+3" },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your resume building activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with building your next resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-20 flex-col gap-2">
              <Link to="/create">
                <PlusCircle className="h-6 w-6" />
                Create New Resume
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2">
              <Link to="/upload">
                <Upload className="h-6 w-6" />
                Upload Existing Resume
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2">
              <Link to="/ats">
                <BarChart3 className="h-6 w-6" />
                Check ATS Score
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Resumes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Resumes</CardTitle>
          <CardDescription>Your recently modified resumes</CardDescription>
        </CardHeader>
        <CardContent>
          {recentResumes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No resumes created yet</p>
              <Button asChild className="mt-4">
                <Link to="/create">Create Your First Resume</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentResumes.map((resume) => (
                <div key={resume.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium text-gray-900">{resume.title}</h3>
                      <p className="text-sm text-gray-500">Modified {formatDate(resume.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">ATS Score</p>
                      <p className={`text-sm font-semibold ${resume.atsScore && resume.atsScore >= 80 ? 'text-green-600' : resume.atsScore && resume.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {resume.atsScore || 'Not checked'}%
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/resumes">View</Link>
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
