// app/page.tsx - Modern Landing Page
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code2, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-2xl text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Code. Collaborate. Create.
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-zinc-300 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            An AI-powered collaborative code editor to bring your ideas to life, faster. Write code together in real-time, execute instantly, and get intelligent suggestions from our AI assistant.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Get Started →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose CodeStream?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-800 rounded-lg p-8 border border-zinc-700 hover:border-blue-500 transition">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Collaboration</h3>
              <p className="text-zinc-400">
                Code together with your team in real-time. Changes sync instantly across all participants.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-800 rounded-lg p-8 border border-zinc-700 hover:border-purple-500 transition">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Assistant</h3>
              <p className="text-zinc-400">
                Get intelligent code suggestions, debugging help, and explanations powered by advanced AI.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-800 rounded-lg p-8 border border-zinc-700 hover:border-emerald-500 transition">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-lg mb-4">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Language Execution</h3>
              <p className="text-zinc-400">
                Write in Java, JavaScript, Python, and more. Execute code instantly with live output.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Build Something Amazing?</h2>
          <p className="text-zinc-400 mb-8">Join thousands of developers collaborating on CodeStream today.</p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Start Coding Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}