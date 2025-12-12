import { Rocket, Play, Sparkles, Users, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { value: "15,000+", label: "Students", icon: Users },
  { value: "100%", label: "Accuracy", icon: TrendingUp },
  { value: "24/7", label: "AI Support", icon: Clock },
];

export function Hero() {
  const navigate = useNavigate();
  
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-hero pt-32 pb-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Hero Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4" />
              AI-Powered Learning Revolution
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Your Personal AI Tutor That Learns{" "}
              <span className="text-gradient">Only From Your Course Materials</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Get 100% accurate answers from YOUR notes—never hallucinated info. Your data stays private, your learning stays on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate("/auth")}
              >
                <Rocket className="w-5 h-5" />
                Start Free Trial
              </Button>
              <Button 
                variant="heroOutline" 
                size="xl"
                onClick={() => scrollToSection("#features")}
              >
                <Play className="w-5 h-5" />
                See How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-10 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-primary" />
                    <span className="text-2xl sm:text-3xl font-display font-bold text-primary">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Main dashboard mockup */}
              <div className="relative bg-card rounded-2xl shadow-2xl border border-border overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-secondary/50 h-8 flex items-center gap-2 px-4">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-hero rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">AI Study Assistant</p>
                      <p className="text-sm text-muted-foreground">Ready to help you learn</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-secondary rounded-full w-full" />
                    <div className="h-4 bg-secondary rounded-full w-4/5" />
                    <div className="h-4 bg-secondary rounded-full w-3/5" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="text-2xl font-bold text-primary">85%</div>
                      <div className="text-xs text-muted-foreground">Progress</div>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                      <div className="text-2xl font-bold text-accent">12</div>
                      <div className="text-xs text-muted-foreground">Tasks Done</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 lg:top-4 lg:-right-8 bg-card shadow-lg rounded-full px-4 py-2 flex items-center gap-2 animate-float border border-border">
                <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
