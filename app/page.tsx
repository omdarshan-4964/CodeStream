// app/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Zap, Users, Sparkles, ArrowRight } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { EnhancedCard, EnhancedCardContent } from "@/components/ui/enhanced-card";
import { EnhancedBadge } from "@/components/ui/enhanced-badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <EnhancedBadge variant="premium" className="text-sm py-1.5 px-4">
                  ✨ Real-time Collaborative Coding
                </EnhancedBadge>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  <span className="bg-linear-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Code Together,
                  </span>
                  <br />
                  <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Create Forever
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                  Experience the future of collaborative development. Write code in real-time with your team, powered by AI assistance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <EnhancedButton size="xl" className="group">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </EnhancedButton>
                </Link>
                
                <EnhancedButton variant="outline" size="xl">
                  View Demo
                </EnhancedButton>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">50K+</div>
                  <div className="text-sm text-muted-foreground">Code Sessions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Code Window Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <EnhancedCard className="overflow-hidden">
                  {/* Window Header */}
                  <div className="flex items-center gap-2 p-4 border-b border-border bg-card/50">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                      <div className="w-3 h-3 rounded-full bg-success" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-muted-foreground font-mono">main.js</span>
                    </div>
                  </div>
                  
                  {/* Code Content */}
                  <EnhancedCardContent className="p-6 font-mono text-sm space-y-2 bg-linear-to-br from-card to-card/50">
                    <div className="flex gap-4">
                      <span className="text-muted-foreground select-none">1</span>
                      <span className="text-secondary">const</span>
                      <span className="text-foreground">collaborate</span>
                      <span className="text-muted-foreground">=</span>
                      <span className="text-success">{`() => {`}</span>
                    </div>
                    <div className="flex gap-4 pl-8">
                      <span className="text-muted-foreground select-none">2</span>
                      <span className="text-foreground">console.log</span>
                      <span className="text-muted-foreground">(</span>
                      <span className="text-[#F59E0B]">{`'Real-time coding!'`}</span>
                      <span className="text-muted-foreground">);</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-muted-foreground select-none">3</span>
                      <span className="text-success">{`}`}</span>
                    </div>
                    <div className="flex gap-4 py-2">
                      <span className="text-muted-foreground select-none">4</span>
                      <span className="text-muted-foreground italic">{`// AI-powered suggestions...`}</span>
                    </div>
                  </EnhancedCardContent>
                </EnhancedCard>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -right-6"
                >
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-xl">
                    <div className="text-xs font-semibold">Live Collaboration</div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-6 -left-6"
                >
                  <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-xl">
                    <div className="text-xs font-semibold">AI Assistant</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose CodeStream?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for seamless collaborative coding
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <EnhancedCard className="h-full hover:scale-105 transition-transform duration-300">
                  <EnhancedCardContent className="p-8 space-y-4">
                    <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </EnhancedCardContent>
                </EnhancedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <EnhancedCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-secondary/20 to-transparent" />
              <EnhancedCardContent className="relative p-12 md:p-20 text-center space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold">
                  Ready to Build Something Amazing?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of developers collaborating on CodeStream today
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <EnhancedButton size="xl">
                      Start Coding Now
                      <Sparkles className="h-5 w-5" />
                    </EnhancedButton>
                  </Link>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Real-time Collaboration",
    description:
      "Code together with your team in real-time. See changes instantly as they happen across all participants.",
    icon: Users,
    gradient: "from-primary to-primary/80",
  },
  {
    title: "AI-Powered Assistant",
    description:
      "Get intelligent code suggestions, debugging help, and explanations powered by Google Gemini AI.",
    icon: Sparkles,
    gradient: "from-secondary to-secondary/80",
  },
  {
    title: "Multi-Language Support",
    description:
      "Write and execute code in Java, JavaScript, Python, and more. All with live output and instant feedback.",
    icon: Code2,
    gradient: "from-success to-success/80",
  },
];