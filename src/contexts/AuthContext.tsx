
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
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
      const userData = { id: existingUser.id, email: existingUser.email, name: existingUser.name };
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
      name
    };
    
    users.push(newUser);
    localStorage.setItem('resumeBuilder_users', JSON.stringify(users));
    
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userData);
    localStorage.setItem('resumeBuilder_user', JSON.stringify(userData));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resumeBuilder_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
