"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, List, User, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PropertyBroker</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/listings" 
              className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1 font-medium"
            >
              <List className="h-4 w-4" />
              <span>Properties</span>
            </Link>
            <Link 
              href="/search" 
              className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1 font-medium"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
          </div>

          {/* Desktop Admin Login & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Link href="/admin/login">
              <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-1 border-blue-200 text-blue-700 hover:bg-blue-50">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/listings"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <List className="h-4 w-4" />
                <span>Properties</span>
              </Link>
              <Link
                href="/search"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Link>
              <Link
                href="/admin/login"
                className="block px-3 py-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors font-medium flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 