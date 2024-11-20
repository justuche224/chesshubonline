import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="mx-auto max-w-7xl text-center">
        <h3 className="text-xl font-semibold mb-4">Explore More</h3>
        <div className="flex justify-center gap-6">
          <Link href="/games" className="text-gray-300 hover:text-white">
            Play Games
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white">
            Contact Us
          </Link>
          <Link href="/analytics" className="text-gray-300 hover:text-white">
            Analytics
          </Link>
          <Link href="/blog" className="text-gray-300 hover:text-white">
            Chess Blog
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
