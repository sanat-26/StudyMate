import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Brain, Star, Play, Info, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#features", label: "Features", icon: Star },
  { href: "#how-it-works", label: "How It Works", icon: Play },
  { href: "#about", label: "About", icon: Info },
  { href: "#contact", label: "Contact", icon: Mail },
];

export function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow duration-300">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-display font-bold text-foreground">StudyMate</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Study Partner</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate("/auth")}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border animate-fade-in">
            <ul className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="flex items-center gap-3 w-full p-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-all"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
