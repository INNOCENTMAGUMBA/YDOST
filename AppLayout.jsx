// src/components/AppLayout.jsx
import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Shield, Users, Wallet, Bell, Settings, 
  Menu, X, ChevronDown, Globe, LogOut 
} from 'lucide-react';

const AppLayout = ({ children, userRole = 'member', userName = 'Guest' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  // Role-based navigation items
  const navItems = {
    member: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'campus', label: 'Campus-Link', icon: BookOpen },
      { id: 'escrow', label: 'Inbox & Escrow', icon: Wallet },
      { id: 'community', label: 'Auto-Groups', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    guest: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'campus', label: 'Campus-Link', icon: BookOpen },
      { id: 'community', label: 'Community', icon: Users },
    ],
    donor: [
      { id: 'dashboard', label: 'Donor Dashboard', icon: Home },
      { id: 'campaigns', label: 'Active Campaigns', icon: Wallet },
      { id: 'impact', label: 'Impact Reports', icon: Shield },
    ],
    embassy: [
      { id: 'dashboard', label: 'Embassy Command', icon: Home },
      { id: 'citizens', label: 'Citizen Registry', icon: Users },
      { id: 'sos', label: 'SOS & Alerts', icon: Shield },
      { id: 'broadcast', label: 'Mass Broadcast', icon: Bell },
    ],
    admin: [
      { id: 'dashboard', label: 'Super Admin', icon: Home },
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'hubs', label: 'Hub Deployment', icon: Globe },
      { id: 'analytics', label: 'Platform Analytics', icon: Settings },
    ]
  };

  const currentNav = navItems[userRole] || navItems.member;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-30`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          {sidebarOpen && (
            <h1 className="text-2xl font-extrabold text-[#1E88E5] tracking-tight">YurtDostluk</h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#1E88E5]/10 text-[#1E88E5] font-bold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className={`flex items-center gap-3 ${sidebarOpen ? 'px-2' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-[#1E88E5] flex items-center justify-center text-white font-bold">
              {userName.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole} Account</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button className="mt-3 w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition text-sm font-medium">
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {currentNav.find(n => n.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full">
              Beta v2.4
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-xl transition relative"
              >
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50">
                  <p className="text-sm font-bold text-gray-900 mb-3">Notifications</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-800 font-medium">Escrow payment received</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-800 font-medium">New group invite: "Kocaeli Telecom"</p>
                      <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition">
              <Globe size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">EN</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>
        </header>

        {/* Dynamic Content Renderer */}
        <div className="p-6 animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
