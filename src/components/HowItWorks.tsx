import { Upload, MessageSquare, Trophy } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Upload & Organize",
    description: "Upload your course materials in any format. Our AI organizes everything for easy access.",
  },
  {
    number: 2,
    icon: MessageSquare,
    title: "Ask & Learn",
    description: "Ask questions about your materials. Get instant, accurate answers from your personal AI tutor.",
  },
  {
    number: 3,
    icon: Trophy,
    title: "Track & Succeed",
    description: "Monitor assignments, set reminders, and track your progress toward academic goals.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            How StudyMate{" "}
            <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to transform your study routine
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-20 left-[15%] right-[15%] h-1 bg-gradient-accent rounded-full" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative text-center"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Step number with icon */}
                <div className="relative inline-flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30 mb-4 relative z-10">
                    <step.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm shadow-md">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
