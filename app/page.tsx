// // app/page.tsx
// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Code2, Zap, Users, Sparkles, ArrowRight } from "lucide-react";
// import { EnhancedButton } from "@/components/ui/enhanced-button";
// import { EnhancedCard, EnhancedCardContent } from "@/components/ui/enhanced-card";
// import { EnhancedBadge } from "@/components/ui/enhanced-badge";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         {/* Animated Background */}
//         <div className="absolute inset-0 -z-10">
//           <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-transparent" />
//           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
//         </div>

//         <div className="container mx-auto px-4 py-20 md:py-32">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             {/* Left Content */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="space-y-8"
//             >
//               <div className="space-y-4">
//                 <EnhancedBadge variant="premium" className="text-sm py-1.5 px-4">
//                   ✨ Real-time Collaborative Coding
//                 </EnhancedBadge>
                
//                 <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
//                   <span className="bg-linear-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
//                     Code Together,
//                   </span>
//                   <br />
//                   <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
//                     Create Forever
//                   </span>
//                 </h1>
                
//                 <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
//                   Experience the future of collaborative development. Write code in real-time with your team, powered by AI assistance.
//                 </p>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Link href="/dashboard">
//                   <EnhancedButton size="xl" className="group">
//                     Get Started Free
//                     <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
//                   </EnhancedButton>
//                 </Link>
                
//                 <EnhancedButton variant="outline" size="xl">
//                   View Demo
//                 </EnhancedButton>
//               </div>

//               {/* Stats */}
//               <div className="flex gap-8 pt-8">
//                 <div>
//                   <div className="text-3xl font-bold text-primary">10K+</div>
//                   <div className="text-sm text-muted-foreground">Active Users</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-secondary">50K+</div>
//                   <div className="text-sm text-muted-foreground">Code Sessions</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-success">99.9%</div>
//                   <div className="text-sm text-muted-foreground">Uptime</div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Right Content - Code Window Mockup */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="relative"
//             >
//               <div className="relative z-10">
//                 <EnhancedCard className="overflow-hidden">
//                   {/* Window Header */}
//                   <div className="flex items-center gap-2 p-4 border-b border-border bg-card/50">
//                     <div className="flex gap-2">
//                       <div className="w-3 h-3 rounded-full bg-destructive" />
//                       <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
//                       <div className="w-3 h-3 rounded-full bg-success" />
//                     </div>
//                     <div className="flex-1 text-center">
//                       <span className="text-xs text-muted-foreground font-mono">main.js</span>
//                     </div>
//                   </div>
                  
//                   {/* Code Content */}
//                   <EnhancedCardContent className="p-6 font-mono text-sm space-y-2 bg-linear-to-br from-card to-card/50">
//                     <div className="flex gap-4">
//                       <span className="text-muted-foreground select-none">1</span>
//                       <span className="text-secondary">const</span>
//                       <span className="text-foreground">collaborate</span>
//                       <span className="text-muted-foreground">=</span>
//                       <span className="text-success">{`() => {`}</span>
//                     </div>
//                     <div className="flex gap-4 pl-8">
//                       <span className="text-muted-foreground select-none">2</span>
//                       <span className="text-foreground">console.log</span>
//                       <span className="text-muted-foreground">(</span>
//                       <span className="text-[#F59E0B]">{`'Real-time coding!'`}</span>
//                       <span className="text-muted-foreground">);</span>
//                     </div>
//                     <div className="flex gap-4">
//                       <span className="text-muted-foreground select-none">3</span>
//                       <span className="text-success">{`}`}</span>
//                     </div>
//                     <div className="flex gap-4 py-2">
//                       <span className="text-muted-foreground select-none">4</span>
//                       <span className="text-muted-foreground italic">{`// AI-powered suggestions...`}</span>
//                     </div>
//                   </EnhancedCardContent>
//                 </EnhancedCard>

//                 {/* Floating Elements */}
//                 <motion.div
//                   animate={{
//                     y: [0, -10, 0],
//                   }}
//                   transition={{
//                     duration: 3,
//                     repeat: Infinity,
//                     ease: "easeInOut",
//                   }}
//                   className="absolute -top-6 -right-6"
//                 >
//                   <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-xl">
//                     <div className="text-xs font-semibold">Live Collaboration</div>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   animate={{
//                     y: [0, 10, 0],
//                   }}
//                   transition={{
//                     duration: 4,
//                     repeat: Infinity,
//                     ease: "easeInOut",
//                     delay: 1,
//                   }}
//                   className="absolute -bottom-6 -left-6"
//                 >
//                   <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-xl">
//                     <div className="text-xs font-semibold">AI Assistant</div>
//                   </div>
//                 </motion.div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 md:py-32">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold mb-4">
//               Why Choose CodeStream?
//             </h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Everything you need for seamless collaborative coding
//             </p>
//           </motion.div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={feature.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: index * 0.1 }}
//                 viewport={{ once: true }}
//               >
//                 <EnhancedCard className="h-full hover:scale-105 transition-transform duration-300">
//                   <EnhancedCardContent className="p-8 space-y-4">
//                     <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center`}>
//                       <feature.icon className="h-7 w-7 text-white" />
//                     </div>
//                     <h3 className="text-2xl font-bold">{feature.title}</h3>
//                     <p className="text-muted-foreground leading-relaxed">
//                       {feature.description}
//                     </p>
//                   </EnhancedCardContent>
//                 </EnhancedCard>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 md:py-32">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <EnhancedCard className="relative overflow-hidden">
//               <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-secondary/20 to-transparent" />
//               <EnhancedCardContent className="relative p-12 md:p-20 text-center space-y-8">
//                 <h2 className="text-4xl md:text-6xl font-bold">
//                   Ready to Build Something Amazing?
//                 </h2>
//                 <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//                   Join thousands of developers collaborating on CodeStream today
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                   <Link href="/dashboard">
//                     <EnhancedButton size="xl">
//                       Start Coding Now
//                       <Sparkles className="h-5 w-5" />
//                     </EnhancedButton>
//                   </Link>
//                 </div>
//               </EnhancedCardContent>
//             </EnhancedCard>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// }

// const features = [
//   {
//     title: "Real-time Collaboration",
//     description:
//       "Code together with your team in real-time. See changes instantly as they happen across all participants.",
//     icon: Users,
//     gradient: "from-primary to-primary/80",
//   },
//   {
//     title: "AI-Powered Assistant",
//     description:
//       "Get intelligent code suggestions, debugging help, and explanations powered by Google Gemini AI.",
//     icon: Sparkles,
//     gradient: "from-secondary to-secondary/80",
//   },
//   {
//     title: "Multi-Language Support",
//     description:
//       "Write and execute code in Java, JavaScript, Python, and more. All with live output and instant feedback.",
//     icon: Code2,
//     gradient: "from-success to-success/80",
//   },
// ];



"use client";

import { motion } from "framer-motion";
import { Code2, Zap, Users, Sparkles, ArrowRight, MessageSquare, Terminal, GitBranch, Mic } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingPageV2() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CodeStream</span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => session ? router.push('/dashboard') : signIn('google')}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm border border-white/20 transition-all"
            >
              {session ? 'Go to Dashboard' : 'Sign In'}
            </motion.button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>Powered by AI & Real-time Collaboration</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold"
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Build The Future,
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Code in Sync
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              The collaborative coding platform where teams unite, AI assists, 
              and ideas transform into reality—all in real-time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <button 
                onClick={() => session ? router.push('/dashboard') : signIn('google')}
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center gap-2 justify-center"
              >
                {session ? 'Go to Dashboard' : 'Start Building Free'}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a href="#features" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-lg backdrop-blur-sm border border-white/20 transition-all inline-block text-center">
                Explore Features
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16"
            >
              {[
                { value: "15K+", label: "Developers" },
                { value: "100K+", label: "Code Sessions" },
                { value: "45+", label: "Languages" },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Interactive Code Window */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-4xl mx-auto mt-20"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-2xl opacity-30" />
              
              {/* Terminal Window */}
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-slate-800/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center text-xs text-gray-400 font-mono">
                    collaborative-session.js
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-xs text-gray-400">3 active</span>
                  </div>
                </div>

                {/* Code Content */}
                <div className="p-6 font-mono text-sm space-y-2">
                  <TypewriterLine delay={0.6} code="const team = new CodeStream();" />
                  <TypewriterLine delay={0.8} code="team.collaborate({ realTime: true });" />
                  <TypewriterLine delay={1.0} code="" />
                  <TypewriterLine delay={1.2} code="// AI suggests: Add error handling" color="text-gray-500" />
                  <TypewriterLine delay={1.4} code="team.enableAI({ provider: 'Gemini' });" />
                  <TypewriterLine delay={1.6} code="team.startCoding(); // 🚀 Let's build!" />
                </div>

                {/* Live Collaboration Indicators */}
                <div className="absolute top-16 right-6 flex flex-col gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-300">Alex is typing...</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.3 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg backdrop-blur-sm"
                  >
                    <Sparkles className="h-3 w-3 text-purple-300" />
                    <span className="text-xs text-purple-300">AI analyzing...</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Everything You Need to Collaborate
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed for modern development teams
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group p-8 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-12 md:p-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/10 rounded-3xl text-center space-y-8 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)]" />
              
              <div className="relative z-10 space-y-8">
                <h2 className="text-5xl md:text-6xl font-bold text-white">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Join thousands of developers building the future with CodeStream
                </p>
                <button 
                  onClick={() => session ? router.push('/dashboard') : signIn('google')}
                  className="group px-10 py-5 bg-white text-slate-900 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-white/50 transition-all inline-flex items-center gap-3"
                >
                  {session ? 'Open Dashboard' : 'Start Your Free Session'}
                  <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </button>
                <p className="text-sm text-gray-400">No credit card required • Free forever</p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

// Typewriter animation component
function TypewriterLine({ code, delay = 0, color = "text-gray-300" }: { code: string; delay?: number; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={`${color}`}
    >
      {code}
    </motion.div>
  );
}

const features = [
  {
    title: "Real-Time Sync",
    description: "Code together with zero lag. Every keystroke, every change—synchronized instantly across your team.",
    icon: Zap,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "AI Code Assistant",
    description: "Get intelligent suggestions, auto-complete, and explanations powered by Google Gemini AI.",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Voice-to-Code",
    description: "Speak your ideas and watch them transform into code. Perfect for brainstorming sessions.",
    icon: Mic,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Git Integration",
    description: "AI-powered commit messages and seamless version control right in your workflow.",
    icon: GitBranch,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Interview Mode",
    description: "Specialized environment for technical interviews with split view and timer functionality.",
    icon: Terminal,
    gradient: "from-red-500 to-rose-500",
  },
  {
    title: "Smart Collaboration",
    description: "Real-time chat, code reviews, and shared cursors make teamwork seamless.",
    icon: MessageSquare,
    gradient: "from-indigo-500 to-purple-500",
  },
];