import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="py-6 bg-sidebar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* CTA Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Improve Your Chess Skills?
          </h2>
          <p className="text-lg mb-6">
            Join thousands of chess enthusiasts! Play games, chat with friends,
            learn strategies, and master your tactics.
          </p>
          <Link href="/auth/register">
            <Button>Sign Up for Free</Button>
          </Link>
        </div>

        {/* Links Section */}
        <h3 className="text-xl font-semibold mb-4">Explore More</h3>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link href="/games" className="hover:underline transition-all">
            Play Games
          </Link>
          <Link href="/friends" className="hover:underline transition-all">
            Friends & Matches
          </Link>
          <Link href="/learn" className="hover:underline transition-all">
            Learn Chess
          </Link>
          <Link href="/about" className="hover:underline transition-all">
            About Us
          </Link>
          <Link href="/contact" className="hover:underline transition-all">
            Contact Us
          </Link>
          <Link href="/analytics" className="hover:underline transition-all">
            Analytics
          </Link>
          <Link href="/blog" className="hover:underline transition-all">
            Chess Blog
          </Link>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Chesshub Online. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
