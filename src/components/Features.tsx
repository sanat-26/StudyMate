import { Upload, MessageCircle, ClipboardCheck, Search } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Course Materials",
    description: "Easily upload your notes, lectures, and resources for any subject. Your AI study assistant references only your materials for personalized answers.",
  },
  {
    icon: MessageCircle,
    title: "AI-Powered Q&A",
    description: "Ask questions related to your course materials. Your AI partner searches through your notes and provides relevant, contextual answers.",
  },
  {
    icon: ClipboardCheck,
    title: "Assignment Tracking",
    description: "Connect your email and let AI track assignments. Get deadline reminders and task assistance based on your course materials.",
  },
  {
    icon: Search,
    title: "Smart Web Search",
    description: "If AI can't find answers in your materials, it intelligently searches the web for relevant sources, saving you valuable time.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Powerful Features for{" "}
            <span className="text-gradient">Academic Success</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to study smarter and achieve better results
          </p>
        </div>

        {/* Features Grid - responsive stacking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-background rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-hero flex items-center justify-center group-hover:bg-gradient-primary transition-all duration-300">
                <feature.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
