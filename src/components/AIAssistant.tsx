
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, User, Bot, Minimize2, Maximize2, Trash2, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'suggestion' | 'normal';
}

const quickSuggestions = [
  "How to improve my resume for ATS?",
  "What are the best resume formats?",
  "How to write a compelling summary?",
  "Interview preparation tips",
  "How to highlight achievements?",
  "What skills should I include?",
  "Cover letter best practices",
  "How to quantify accomplishments?"
];

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Career Assistant. I can help you with resume writing, job search strategies, ATS optimization, interview preparation, and career advice. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isOpen]);

  const getDetailedAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('resume') && (message.includes('tips') || message.includes('improve'))) {
      return `Here are comprehensive resume improvement tips:

**Structure & Format:**
• Use a clean, professional layout with consistent formatting
• Keep it to 1-2 pages maximum
• Use standard fonts (Arial, Calibri, Times New Roman)
• Maintain consistent spacing and margins

**Content Strategy:**
• Start with a compelling professional summary
• Use action verbs (achieved, implemented, led, optimized)
• Quantify achievements with numbers and percentages
• Include relevant keywords from job descriptions
• Show progression and career growth

**ATS Optimization:**
• Use standard section headings (Experience, Education, Skills)
• Avoid graphics, tables, and complex formatting
• Include both acronyms and full terms (SEO & Search Engine Optimization)
• Use keywords naturally throughout the content

**Common Mistakes to Avoid:**
• Generic objective statements
• Listing job duties instead of achievements
• Including irrelevant personal information
• Using unprofessional email addresses

Would you like me to elaborate on any specific section?`;
    }
    
    if (message.includes('ats') || message.includes('applicant tracking')) {
      return `ATS (Applicant Tracking System) Optimization Guide:

**What is ATS?**
Software used by employers to filter and rank resumes before human review. 90% of large companies use ATS systems.

**Key Optimization Strategies:**
• Use standard section headers (Work Experience, Education, Skills)
• Include keywords from the job posting naturally
• Use both acronyms and full terms (e.g., "AI" and "Artificial Intelligence")
• Choose simple, readable fonts
• Avoid headers, footers, graphics, and tables
• Save as .docx or PDF (check job posting requirements)

**Keyword Strategies:**
• Mirror the job description language
• Include industry-specific terms
• Use variations of important skills
• Include soft skills mentioned in the posting

**Testing Your Resume:**
• Use our built-in ATS analyzer
• Copy/paste your resume into plain text to check formatting
• Ensure all information remains readable

**Scoring Factors:**
• Keyword matching (40%)
• Work experience relevance (30%)
• Education and skills alignment (20%)
• Resume format and readability (10%)

Our ATS analyzer can give you a detailed score and improvement suggestions!`;
    }
    
    if (message.includes('job search') || message.includes('interview')) {
      return `Complete Job Search & Interview Strategy:

**Job Search Best Practices:**
• Set up job alerts on multiple platforms (LinkedIn, Indeed, company websites)
• Network actively - 70% of jobs aren't publicly posted
• Customize your resume for each application
• Research companies thoroughly before applying
• Follow up strategically (wait 1-2 weeks)

**Interview Preparation:**
• Research the company, role, and interviewer
• Prepare STAR method examples (Situation, Task, Action, Result)
• Practice common questions out loud
• Prepare thoughtful questions to ask them
• Plan your outfit and route in advance

**Common Interview Questions & How to Answer:**
• "Tell me about yourself" - Professional summary in 2 minutes
• "Why do you want this role?" - Connect your goals to their needs
• "What's your weakness?" - Share a real weakness + improvement plan
• "Where do you see yourself in 5 years?" - Show growth mindset

**Salary Negotiation:**
• Research market rates using Glassdoor, PayScale
• Consider the full compensation package
• Wait for them to make the first offer
• Negotiate based on value you bring

**Follow-up Strategy:**
• Send thank-you email within 24 hours
• Include specific conversation points
• Reiterate your interest and qualifications

Need help with any specific aspect?`;
    }
    
    if (message.includes('skills') || message.includes('experience')) {
      return `Skills & Experience Optimization Guide:

**Hard Skills to Highlight:**
• Technical skills relevant to your field
• Software proficiency (be specific about versions)
• Industry certifications and licenses
• Languages (specify proficiency level)
• Quantifiable achievements with metrics

**Soft Skills That Matter:**
• Leadership and team collaboration
• Problem-solving and critical thinking
• Communication (written and verbal)
• Adaptability and learning agility
• Project management and organization

**How to Present Experience:**
• Use the CAR method (Challenge, Action, Result)
• Start bullet points with strong action verbs
• Include numbers, percentages, and timeframes
• Show progression and increased responsibilities
• Connect past experience to target role requirements

**Skills Section Strategy:**
• List most relevant skills first
• Group similar skills together
• Include both technical and soft skills
• Match skills to job description keywords
• Rate proficiency if appropriate

**Experience Without Traditional Jobs:**
• Freelance and consulting work
• Volunteer experience and community involvement
• Personal projects and side businesses
• Online courses and certifications
• Internships and academic projects

**Transferable Skills Examples:**
• Customer service → Client relationship management
• Teaching → Training and mentoring
• Sales → Persuasion and negotiation
• Event planning → Project management

What specific skills or experience would you like help highlighting?`;
    }
    
    if (message.includes('cover letter')) {
      return `Professional Cover Letter Guide:

**Structure (3-4 paragraphs):**

**Opening Paragraph:**
• Address hiring manager by name when possible
• State the position you're applying for
• Include a compelling hook that shows enthusiasm
• Mention how you learned about the opportunity

**Body Paragraph(s):**
• Highlight 2-3 most relevant achievements
• Connect your experience to their specific needs
• Use specific examples with quantifiable results
• Show knowledge of the company and role

**Closing Paragraph:**
• Reiterate your interest and enthusiasm
• Include a clear call to action
• Thank them for their consideration
• Professional sign-off

**Best Practices:**
• Keep it to one page maximum
• Use the same header as your resume
• Customize for each application
• Use keywords from the job posting
• Show personality while remaining professional

**Common Mistakes to Avoid:**
• Generic, template-like language
• Repeating everything from your resume
• Focusing on what you want vs. what you offer
• Poor grammar or spelling errors
• Being too casual or too formal

**Power Phrases to Use:**
• "I am excited to contribute..."
• "My experience in [X] aligns perfectly with..."
• "I would welcome the opportunity to..."
• "I am confident that my background in..."

Need help with a specific cover letter section?`;
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello! Welcome to your AI Career Assistant! 👋

I'm here to help you succeed in your career journey. Here's what I can assist you with:

**Resume Services:**
• Writing and formatting guidance
• ATS optimization strategies
• Skills and experience highlighting
• Industry-specific advice

**Job Search Support:**
• Application strategies
• Company research tips
• Networking guidance
• Follow-up best practices

**Interview Preparation:**
• Common question preparation
• STAR method coaching
• Salary negotiation tips
• Body language and presentation

**Career Development:**
• Skill gap analysis
• Career transition advice
• Professional growth strategies
• Industry insights

**Quick Actions:**
• Try asking: "How to improve my resume for ATS?"
• Or: "What are the best interview preparation tips?"
• Or: "Help me write a compelling professional summary"

What specific area would you like to focus on today?`;
    }

    if (message.includes('summary') || message.includes('objective')) {
      return `Professional Summary Writing Guide:

**What Makes a Great Summary:**
• 3-4 lines that capture your professional essence
• Includes years of experience and key expertise
• Mentions your target role or career focus
• Highlights your most impressive achievement
• Uses industry keywords naturally

**Formula That Works:**
[Years of experience] + [Job title/field] + [Key skills] + [Notable achievement] + [Career goal]

**Example Templates:**

*For Experienced Professionals:*
"Results-driven Marketing Manager with 7+ years of experience in digital marketing and brand strategy. Led campaigns that increased revenue by 150% and managed budgets exceeding $2M. Expert in SEO, content marketing, and team leadership. Seeking to leverage proven track record in driving growth for a Fortune 500 company."

*For Career Changers:*
"Detail-oriented Project Coordinator transitioning to UX Design with 5 years of experience managing cross-functional teams and 2 years of hands-on design training. Successfully completed 15+ user experience projects and earned Google UX Certificate. Passionate about creating intuitive digital experiences that solve real user problems."

*For Recent Graduates:*
"Recent Computer Science graduate with internship experience at tech startups and strong foundation in full-stack development. Built 10+ web applications using React, Node.js, and Python. Contributed to open-source projects with 500+ GitHub stars. Eager to contribute technical skills and fresh perspective to innovative software development team."

**Words That Make Impact:**
• Action words: Led, achieved, implemented, optimized
• Quantifiers: Increased, reduced, managed, delivered
• Industry terms: Relevant to your target field
• Soft skills: Leadership, collaboration, innovation

**Avoid These Mistakes:**
• Generic phrases like "hard-working" or "team player"
• Vague statements without specifics
• Information that's not relevant to target role
• Using "I" or first-person pronouns

Would you like help crafting your specific professional summary?`;
    }
    
    return `I understand you're looking for career guidance! Here are some ways I can help you:

**Popular Topics:**
• Resume writing and ATS optimization
• Interview preparation and strategies
• Job search best practices
• Professional networking tips
• Career transition guidance
• Salary negotiation tactics

**Specific Areas of Expertise:**
• Industry-specific resume advice
• Technical skills highlighting
• Cover letter writing
• LinkedIn profile optimization
• Professional development planning

**Quick Suggestions:**
• "How do I write a compelling professional summary?"
• "What are the best ATS optimization strategies?"
• "How should I prepare for behavioral interviews?"
• "What skills are most in-demand in [your industry]?"

Try asking me something more specific, or choose from the suggestions above. I'm here to provide detailed, actionable advice for your career success!`;
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
    setShowSuggestions(false);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getDetailedAIResponse(inputText),
      sender: 'assistant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    setShowSuggestions(false);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: "Hello! I'm your AI Career Assistant. I can help you with resume writing, job search strategies, ATS optimization, interview preparation, and career advice. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }]);
    setShowSuggestions(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-200 relative"
            >
              <MessageCircle className="h-5 w-5" />
              {messages.length > 1 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                  {messages.length - 1}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md h-[600px] p-0">
            <DialogHeader className="p-4 pb-2 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2 text-base">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Career Assistant
                </DialogTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex flex-col h-full">
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[85%] p-3 rounded-lg whitespace-pre-line text-sm ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {message.text}
                      </div>
                      
                      {message.sender === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {showSuggestions && messages.length === 1 && (
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-3">Quick suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto py-1 px-2"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about resumes, interviews, job search..."
                    disabled={isLoading}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputText.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  AI responses are for guidance only
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
