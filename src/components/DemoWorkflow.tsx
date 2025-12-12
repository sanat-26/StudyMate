import { useState, useEffect } from "react";
import { Upload, MessageCircle, Sparkles, TrendingUp, Check, FileText, Send } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Upload Your Notes",
    icon: Upload,
    content: {
      type: "upload",
      files: ["Organic_Chemistry_Ch5.pdf", "Lecture_Notes_Week4.docx", "Study_Guide_Midterm.pdf"],
    },
  },
  {
    id: 2,
    title: "Ask a Question",
    icon: MessageCircle,
    content: {
      type: "chat",
      question: "What is the mechanism for SN2 reactions?",
    },
  },
  {
    id: 3,
    title: "Get AI Answer",
    icon: Sparkles,
    content: {
      type: "answer",
      response: "Based on your Organic Chemistry Chapter 5 notes, SN2 (Substitution Nucleophilic Bimolecular) involves a one-step mechanism where the nucleophile attacks the substrate from the backside while the leaving group departs simultaneously...",
      source: "From: Organic_Chemistry_Ch5.pdf, Page 23",
    },
  },
  {
    id: 4,
    title: "Track Progress",
    icon: TrendingUp,
    content: {
      type: "progress",
      stats: { questionsAnswered: 47, topicsLearned: 12, studyStreak: 5 },
    },
  },
];

export function DemoWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
        setIsAnimating(false);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const currentStep = steps[activeStep];

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            See StudyMate{" "}
            <span className="text-gradient">In Action</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Watch how easy it is to supercharge your studying in seconds
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step Indicators */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-8">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-300 ${
                  activeStep === index
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-muted-foreground hover:bg-secondary border border-border"
                }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                <span className="text-sm font-medium sm:hidden">{step.id}</span>
              </button>
            ))}
          </div>

          {/* Demo Window */}
          <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
            {/* Window Header */}
            <div className="bg-secondary/50 h-10 flex items-center gap-2 px-4 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-accent/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
              <span className="ml-4 text-sm text-muted-foreground font-medium">
                StudyMate - {currentStep.title}
              </span>
            </div>

            {/* Demo Content */}
            <div className={`p-6 sm:p-8 min-h-[320px] transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
              {currentStep.content.type === "upload" && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-primary/5">
                    <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-foreground font-medium mb-2">Drop your files here</p>
                    <p className="text-sm text-muted-foreground">Supports PDF, DOCX, PPTX, and more</p>
                  </div>
                  <div className="space-y-2">
                    {currentStep.content.files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg animate-fade-in"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-sm text-foreground flex-grow">{file}</span>
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep.content.type === "chat" && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-foreground">You</span>
                    </div>
                    <div className="flex-grow">
                      <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tl-sm max-w-md">
                        <p className="text-sm">{currentStep.content.question}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-sm">AI is searching your notes...</span>
                  </div>
                </div>
              )}

              {currentStep.content.type === "answer" && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="bg-secondary p-4 rounded-2xl rounded-tl-sm">
                        <p className="text-sm text-foreground leading-relaxed">
                          {currentStep.content.response}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-primary">
                        <FileText className="w-4 h-4" />
                        <span>{currentStep.content.source}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep.content.type === "progress" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-6 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {currentStep.content.stats.questionsAnswered}
                      </div>
                      <div className="text-xs text-muted-foreground">Questions Answered</div>
                    </div>
                    <div className="text-center p-6 bg-accent/5 rounded-xl border border-accent/20">
                      <div className="text-3xl font-bold text-accent mb-1">
                        {currentStep.content.stats.topicsLearned}
                      </div>
                      <div className="text-xs text-muted-foreground">Topics Learned</div>
                    </div>
                    <div className="text-center p-6 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {currentStep.content.stats.studyStreak}
                      </div>
                      <div className="text-xs text-muted-foreground">Day Streak 🔥</div>
                    </div>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground font-medium">Weekly Goal Progress</span>
                      <span className="text-primary font-semibold">78%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-primary rounded-full w-[78%] transition-all duration-1000" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeStep === index ? "bg-primary w-8" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
