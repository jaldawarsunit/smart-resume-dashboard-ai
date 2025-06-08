
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, User, Bot, Minimize2, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. I can help you with resume writing, job search tips, ATS optimization, and career advice. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('resume') && message.includes('tips')) {
      return "Here are some key resume tips:\n\n1. Keep it concise (1-2 pages max)\n2. Use action verbs and quantifiable achievements\n3. Tailor it to each job application\n4. Include relevant keywords from the job description\n5. Use a clean, professional format\n6. Proofread carefully for errors\n\nWould you like specific advice for any section of your resume?";
    }
    
    if (message.includes('ats') || message.includes('applicant tracking')) {
      return "ATS (Applicant Tracking System) optimization tips:\n\n1. Use standard section headings (Experience, Education, Skills)\n2. Include keywords from the job posting\n3. Use simple formatting - avoid tables, graphics, headers/footers\n4. Save as .docx or PDF (check job posting requirements)\n5. Use standard fonts like Arial, Calibri, or Times New Roman\n6. Spell out abbreviations\n\nOur ATS analyzer can help you check your resume's compatibility!";
    }
    
    if (message.includes('job search') || message.includes('interview')) {
      return "Job search and interview tips:\n\n1. Research the company thoroughly\n2. Practice common interview questions\n3. Prepare specific examples using the STAR method\n4. Network actively on LinkedIn\n5. Follow up after applications and interviews\n6. Customize your application for each role\n\nWhat specific aspect of job searching would you like help with?";
    }
    
    if (message.includes('skills') || message.includes('experience')) {
      return "When listing skills and experience:\n\n1. Focus on relevant, transferable skills\n2. Use specific examples and metrics\n3. Include both hard and soft skills\n4. Group similar skills together\n5. Prioritize skills mentioned in job postings\n6. Show progression and growth\n\nWould you like help identifying skills for a specific role?";
    }
    
    if (message.includes('cover letter')) {
      return "Cover letter best practices:\n\n1. Address it to a specific person when possible\n2. Keep it to one page\n3. Show enthusiasm for the role and company\n4. Complement, don't repeat your resume\n5. Include specific examples of achievements\n6. End with a clear call to action\n\nWould you like help structuring your cover letter?";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help you with all things career-related. I can assist with:\n\n• Resume writing and optimization\n• ATS compatibility tips\n• Interview preparation\n• Job search strategies\n• Cover letter guidance\n• Career advice\n\nWhat would you like to work on today?";
    }
    
    return "I'd be happy to help you with that! As your career assistant, I can provide guidance on:\n\n• Resume writing and formatting\n• ATS optimization\n• Job search strategies\n• Interview preparation\n• Career development\n\nCould you be more specific about what you'd like help with? For example, you could ask about 'resume tips', 'ATS optimization', or 'interview advice'.";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getAIResponse(inputText),
      sender: 'assistant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button - Made smaller */}
      <div className="fixed bottom-4 right-4 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="rounded-full h-10 w-10 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm h-[450px] p-0">
            <DialogHeader className="p-3 pb-2">
              <DialogTitle className="flex items-center gap-2 text-sm">
                <Bot className="h-4 w-4 text-primary" />
                AI Career Assistant
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'assistant' && (
                        <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Bot className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] p-2 rounded-lg whitespace-pre-line text-xs ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {message.text}
                      </div>
                      
                      {message.sender === 'user' && (
                        <div className="flex-shrink-0 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-2 justify-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <div className="bg-muted p-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about resumes..."
                    disabled={isLoading}
                    className="text-xs"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputText.trim()}
                    size="sm"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
