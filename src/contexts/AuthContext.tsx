
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('resumeBuilder_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock login - in real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('resumeBuilder_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (existingUser) {
      const userData = { 
        id: existingUser.id, 
        email: existingUser.email, 
        name: existingUser.name,
        profileImage: existingUser.profileImage 
      };
      setUser(userData);
      localStorage.setItem('resumeBuilder_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock registration
    const users = JSON.parse(localStorage.getItem('resumeBuilder_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      profileImage: ''
    };
    
    users.push(newUser);
    localStorage.setItem('resumeBuilder_users', JSON.stringify(users));
    
    const userData = { 
      id: newUser.id, 
      email: newUser.email, 
      name: newUser.name,
      profileImage: newUser.profileImage 
    };
    setUser(userData);
    localStorage.setItem('resumeBuilder_user', JSON.stringify(userData));
    
    setIsLoading(false);
    return true;
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const updatedUser = { ...user, ...updates };
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('resumeBuilder_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('resumeBuilder_users', JSON.stringify(users));
      }
      
      // Update current user
      setUser(updatedUser);
      localStorage.setItem('resumeBuilder_user', JSON.stringify(updatedUser));
      
      return true;
    } catch {
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const users = JSON.parse(localStorage.getItem('resumeBuilder_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) return false;
      
      // Check current password
      if (users[userIndex].password !== currentPassword) return false;
      
      // Update password
      users[userIndex].password = newPassword;
      localStorage.setItem('resumeBuilder_users', JSON.stringify(users));
      
      return true;
    } catch {
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // Remove from users array
      const users = JSON.parse(localStorage.getItem('resumeBuilder_users') || '[]');
      const filteredUsers = users.filter((u: any) => u.id !== user.id);
      localStorage.setItem('resumeBuilder_users', JSON.stringify(filteredUsers));
      
      // Remove user resumes
      const resumes = JSON.parse(localStorage.getItem('resumeBuilder_resumes') || '[]');
      const filteredResumes = resumes.filter((r: any) => r.userId !== user.id);
      localStorage.setItem('resumeBuilder_resumes', JSON.stringify(filteredResumes));
      
      // Clear current user
      setUser(null);
      localStorage.removeItem('resumeBuilder_user');
      
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resumeBuilder_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateProfile, 
      changePassword, 
      deleteAccount, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
