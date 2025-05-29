
import { useState, useEffect } from 'react';
import { Resume } from '@/types/resume';
import { useAuth } from '@/contexts/AuthContext';

export function useResumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadResumes();
  }, [user]);

  const loadResumes = () => {
    if (!user) {
      setResumes([]);
      setIsLoading(false);
      return;
    }

    const allResumes = JSON.parse(localStorage.getItem('resumeBuilder_resumes') || '[]');
    const userResumes = allResumes.filter((resume: Resume) => resume.userId === user.id);
    setResumes(userResumes);
    setIsLoading(false);
  };

  const saveResume = (resumeData: Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return null;

    const newResume: Resume = {
      ...resumeData,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const allResumes = JSON.parse(localStorage.getItem('resumeBuilder_resumes') || '[]');
    allResumes.push(newResume);
    localStorage.setItem('resumeBuilder_resumes', JSON.stringify(allResumes));
    
    setResumes(prev => [...prev, newResume]);
    return newResume;
  };

  const updateResume = (id: string, resumeData: Partial<Resume>) => {
    if (!user) return null;

    const allResumes = JSON.parse(localStorage.getItem('resumeBuilder_resumes') || '[]');
    const resumeIndex = allResumes.findIndex((r: Resume) => r.id === id && r.userId === user.id);
    
    if (resumeIndex === -1) return null;

    const updatedResume = {
      ...allResumes[resumeIndex],
      ...resumeData,
      updatedAt: new Date().toISOString(),
    };

    allResumes[resumeIndex] = updatedResume;
    localStorage.setItem('resumeBuilder_resumes', JSON.stringify(allResumes));
    
    setResumes(prev => prev.map(r => r.id === id ? updatedResume : r));
    return updatedResume;
  };

  const deleteResume = (id: string) => {
    if (!user) return;

    const allResumes = JSON.parse(localStorage.getItem('resumeBuilder_resumes') || '[]');
    const filteredResumes = allResumes.filter((r: Resume) => !(r.id === id && r.userId === user.id));
    localStorage.setItem('resumeBuilder_resumes', JSON.stringify(filteredResumes));
    
    setResumes(prev => prev.filter(r => r.id !== id));
  };

  const getResume = (id: string): Resume | null => {
    return resumes.find(r => r.id === id) || null;
  };

  return {
    resumes,
    isLoading,
    saveResume,
    updateResume,
    deleteResume,
    getResume,
    loadResumes,
  };
}
