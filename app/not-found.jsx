"use client";

import { Home, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar p-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* Animated 404 Text */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-gray-200 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertCircle className="w-20 h-20 text-red-500 animate-bounce" />
          </div>
        </div>

        {/* Glitch Effect Text */}
        <div className="relative">
          <h2
            className="text-4xl font-bold text-gray-800 mb-2 
                         hover:text-transparent hover:bg-clip-text 
                         hover:bg-gradient-to-r hover:from-purple-400 
                         hover:to-pink-600 transition-all duration-300"
          >
            Page Not Found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Oops! Looks like you&apos;ve ventured into uncharted territory. The
            page you&apos;re looking for seems to have gone on an adventure
            without us.
          </p>
        </div>

        {/* Interactive Elements */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            className="group relative overflow-hidden bg-white hover:bg-gray-50 hover:text-purple-600
                     text-gray-800 px-6 py-3 rounded-lg shadow-md 
                     transition-all duration-300 ease-in-out"
            onClick={() => window.history.back()}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Go Back
            </span>
          </Button>

          <Button
            className="group relative overflow-hidden bg-gradient-to-r 
                     from-purple-500 to-pink-500 hover:from-purple-600 
                     hover:to-pink-600 text-white px-6 py-3 rounded-lg 
                     shadow-md transition-all duration-300 ease-in-out"
            onClick={() => (window.location.href = "/")}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </span>
          </Button>
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

export default NotFound;
