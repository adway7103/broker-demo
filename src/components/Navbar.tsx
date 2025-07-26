import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, List, User } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PropertyBroker</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/listings" 
              className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <List className="h-4 w-4" />
              <span>Properties</span>
            </Link>
            <Link 
              href="/search" 
              className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
          </div>

          {/* Admin Login */}
          <div className="flex items-center space-x-4">
            <Link href="/admin/login">
              <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 