"use client";
import { Rocket, Clock } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";

const ComingSoon = () => {
  //   const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar p-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* Animated Rocket */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-gray-200 animate-pulse">
            SOON
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket className="w-20 h-20 text-purple-500 animate-bounce" />
          </div>
        </div>

        {/* Glitch Effect Text */}
        <div className="relative">
          <h2
            className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2
                       hover:text-transparent hover:bg-clip-text
                       hover:bg-gradient-to-r hover:from-purple-400
                       hover:to-pink-600 transition-all duration-300
                       dark:hover:text-transparent dark:hover:bg-clip-text
                       dark:hover:bg-gradient-to-r dark:hover:from-purple-400
                       dark:hover:to-pink-600"
          >
            Something Awesome is Coming
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We&apos;re working hard to bring you an incredible experience. Stay
            tuned and be the first to know when we launch!
          </p>
        </div>

        {/* Email Signup */}
        {/* <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <div className="relative w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 pr-16 rounded-lg border 
                         focus:ring-2 focus:ring-purple-400 
                         focus:border-transparent 
                         transition duration-300"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 
                         hover:bg-purple-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-purple-600" />
            </Button>
          </div>
        </div> */}

        {/* Countdown Timer */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <Clock className="w-6 h-6 text-gray-500" />
          <span className="text-xl font-semibold text-gray-700">
            Launching in: Soon
          </span>
        </div>

        {/* Decorative Elements */}
        <div className="grid grid-cols-3 gap-4 mt-12 opacity-50">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500
                         animate-pulse"
              style={{
                animationDelay: `${i * 200}ms`,
                opacity: 1 - i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
