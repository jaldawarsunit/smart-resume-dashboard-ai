
export interface Resume {
  id: string;
  userId: string;
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
  createdAt: string;
  updatedAt: string;
  atsScore?: number;
}
