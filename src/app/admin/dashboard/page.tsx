"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Home, Users, Heart, LogOut } from "lucide-react";
import { SmartLinkBuilder } from "@/components/SmartLinkBuilder";

interface AdminSession {
  email: string;
  name: string;
  isAdmin: boolean;
  timestamp: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    leads: 0,
    shortlists: 0,
  });

  useEffect(() => {
    // Check if user is logged in
    const adminSession = localStorage.getItem('adminSession');
    
    if (!adminSession) {
      router.push("/admin/login");
      return;
    }

    try {
      const sessionData: AdminSession = JSON.parse(adminSession);
      
      // Check if session is expired (24 hours)
      const isExpired = Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000;
      
      if (isExpired || !sessionData.isAdmin) {
        localStorage.removeItem('adminSession');
        router.push("/admin/login");
        return;
      }

      setSession(sessionData);
      setLoading(false);

      // Fetch dashboard stats
      fetchStats();
    } catch (error) {
      console.error("Session error:", error);
      localStorage.removeItem('adminSession');
      router.push("/admin/login");
    }
  }, [router]);

  const fetchStats = async () => {
    try {
      const [propertiesRes, leadsRes, shortlistsRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/leads'),
        fetch('/api/shortlists'),
      ]);

      const [properties, leads, shortlists] = await Promise.all([
        propertiesRes.json(),
        leadsRes.json(),
        shortlistsRes.json(),
      ]);

      setStats({
        properties: properties.pagination?.total || 0,
        leads: leads.pagination?.total || 0,
        shortlists: shortlists.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session.name || session.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Button className="flex items-center gap-2" onClick={() => router.push('/admin/properties/new')}>
            <Plus className="h-4 w-4" />
            Add New Property
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.properties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.leads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Shortlists</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.shortlists}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/admin/properties')}
              >
                View All Properties
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/admin/properties/new')}
              >
                Add New Property
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/admin/leads')}
              >
                View All Leads
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/admin/shortlists')}
              >
                View Shortlists
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Smart Link Builder */}
        <div className="mt-6">
          <SmartLinkBuilder />
        </div>
      </div>
    </div>
  );
} 