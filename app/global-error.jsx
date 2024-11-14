"use client";

import React from "react";
import { Home, RefreshCcw, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorPage = ({ error, reset }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* Animated Error Symbol */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-gray-200 animate-pulse">
            500
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Bug className="w-20 h-20 text-orange-500 animate-bounce" />
          </div>
        </div>

        {/* Error Message with Glitch Effect */}
        <div className="relative">
          <h2
            className="text-4xl font-bold text-gray-800 mb-2 
                         hover:text-transparent hover:bg-clip-text 
                         hover:bg-gradient-to-r hover:from-orange-400 
                         hover:to-red-600 transition-all duration-300"
          >
            Oops! Something Went Wrong
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Don&apos;t worry, it&apos;s not you - it&apos;s us! Our team of
            digital mechanics has been notified and is working on fixing this
            issue.
          </p>
        </div>

        {/* Error Details (if available) */}
        {error && (
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
            <p className="text-gray-600 text-sm font-mono">
              {error.message || "An unexpected error occurred"}
            </p>
          </div>
        )}

        {/* Interactive Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            className="group relative overflow-hidden bg-white hover:bg-gray-50 
                     text-gray-800 px-6 py-3 rounded-lg shadow-md 
                     transition-all duration-300 ease-in-out"
            onClick={() => reset?.()}
          >
            <span className="relative z-10 flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </span>
          </Button>

          <Button
            className="group relative overflow-hidden bg-gradient-to-r 
                     from-orange-500 to-red-500 hover:from-orange-600 
                     hover:to-red-600 text-white px-6 py-3 rounded-lg 
                     shadow-md transition-all duration-300 ease-in-out"
            onClick={() => (window.location.href = "/")}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </span>
          </Button>
        </div>

        {/* Animated Loading Bars */}
        <div className="grid grid-cols-3 gap-4 mt-12 opacity-50">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 
                       animate-pulse"
              style={{
                animationDelay: `${i * 200}ms`,
                opacity: 1 - i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Technical Details (Optional) */}
        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-gray-500 hover:text-gray-700 
                     transition-colors duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              Refresh Page
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
