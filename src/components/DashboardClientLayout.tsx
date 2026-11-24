'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

interface DashboardClientLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role?: string;
  };
}

export default function DashboardClientLayout({
  children,
  user,
}: DashboardClientLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-row font-sans text-gray-800">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setCollapsed(!collapsed)}
          adminName={user.name}
          adminEmail={user.email}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
