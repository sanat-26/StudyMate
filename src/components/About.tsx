import { CheckCircle, Shield, Zap, Globe } from "lucide-react";

const benefits = [
  { icon: CheckCircle, text: "Personalized learning experience" },
  { icon: Zap, text: "Time-saving automation" },
  { icon: Shield, text: "Data privacy guaranteed" },
  { icon: Globe, text: "Cross-platform accessibility" },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              Why Choose{" "}
              <span className="text-gradient">StudyMate?</span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground text-lg mb-8">
              <p>
                StudyMate is designed to help students stay on top of their studies, manage assignments, and get personalized recommendations to improve academic performance. By leveraging cutting-edge AI, StudyMate helps you study smarter, not harder.
              </p>
              <p>
                Whether you're struggling to stay organized or need help understanding complex concepts, StudyMate is your dedicated 24/7 study partner.
              </p>
            </div>

            {/* Benefits list */}
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative">
              {/* Main card */}
              <div className="bg-gradient-hero rounded-3xl p-8 lg:p-12 border border-border">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="font-display font-bold text-foreground mb-1">Secure</h4>
                    <p className="text-sm text-muted-foreground">Your data is encrypted</p>
                  </div>
                  
                  <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
                    <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="font-display font-bold text-foreground mb-1">Fast</h4>
                    <p className="text-sm text-muted-foreground">Instant AI responses</p>
                  </div>
                  
                  <div className="col-span-2 bg-card rounded-2xl p-6 shadow-md border border-border">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-foreground">Available Everywhere</h4>
                        <p className="text-sm text-muted-foreground">Web, mobile, and desktop</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2 flex-1 bg-primary rounded-full" />
                      <div className="h-2 flex-1 bg-accent rounded-full" />
                      <div className="h-2 flex-1 bg-primary/50 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/20 rounded-full blur-xl animate-float" />
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
