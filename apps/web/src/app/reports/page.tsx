'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { LayoutDashboard, Shield, AlertTriangle, Activity, Server, Bell, LogOut, UserCircle, FileText, Download, FileSpreadsheet, Calendar, UserPlus, KeyRound, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) setUser(JSON.parse(userData));

    const fetchSummary = async () => {
      try {
        const res = await axios.get('http://localhost:3000/reports/summary', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setSummary(res.data);
      } catch (err) {
        console.error('Failed to fetch summary', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [router]);

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object');
    const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
    return [headers.join(','), ...rows].join('\n');
  };

  const downloadCSV = (data: any[], filename: string) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + '-' + new Date().toISOString().slice(0,10) + '.csv';
    link.click();
  };

  const handleGenerateReport = async (type: string) => {
    setGenerating(type);
    try {
      const token = Cookies.get('token');
      const res = await axios.get('http://localhost:3000/reports/' + type, {
        headers: { Authorization: 'Bearer ' + token }
      });
      downloadCSV(res.data, type + '-report');
    } catch (err) {
      console.error('Failed to generate report', err);
    } finally {
      setGenerating(null);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  if (!user || loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  const reportCards = [
    { 
      id: 'assets', 
      title: 'Asset Health Report', 
      description: 'All industrial assets with health status, criticality, and facility info.',
      icon: Server,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    { 
      id: 'incidents', 
      title: 'Incident Report', 
      description: 'All operational incidents with severity, status, and facility.',
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      id: 'security', 
      title: 'Security Report', 
      description: 'All detected threats, IDS alerts, and security events.',
      icon: Shield,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    },
    { 
      id: 'infrastructure', 
      title: 'Infrastructure Report', 
      description: 'Server metrics and IT infrastructure health.',
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Shield className="w-8 h-8 text-blue-500 mr-3" />
          <span className="text-white font-bold text-lg tracking-tight">Sentinel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Overview
          </Link>
          <Link href="/assets" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Server className="w-5 h-5 mr-3" /> Assets
          </Link>
          <Link href="/ai" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Activity className="w-5 h-5 mr-3" /> AI Intelligence
          </Link>
          <Link href="/security" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Shield className="w-5 h-5 mr-3" /> Security
          </Link>
          <Link href="/incidents" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <AlertTriangle className="w-5 h-5 mr-3" /> Incidents
          </Link>
          <Link href="/notifications" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5 mr-3" /> Notifications
          </Link>
          <Link href="/reports" className="flex items-center px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <FileText className="w-5 h-5 mr-3" /> Reports
          </Link>
          <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="px-4 text-xs text-slate-500 uppercase tracking-wider mb-2">Administration</p>
            <Link href="/admin/users" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
              <UserPlus className="w-5 h-5 mr-3" /> User Management
            </Link>
            <Link href="/admin/roles" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
              <KeyRound className="w-5 h-5 mr-3" /> Role Management
            </Link>
            <Link href="/admin/facilities" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
              <Building2 className="w-5 h-5 mr-3" /> Facility Management
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-white">Reports</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-white">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {/* Summary */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-400 mb-1">Total Assets</p>
                <p className="text-3xl font-bold text-white">{summary.totalAssets}</p>
              </div>
              <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-400 mb-1">Total Incidents</p>
                <p className="text-3xl font-bold text-yellow-500">{summary.totalIncidents}</p>
              </div>
              <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-400 mb-1">Total Threats</p>
                <p className="text-3xl font-bold text-red-500">{summary.totalThreats}</p>
              </div>
              <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-400 mb-1">Total Facilities</p>
                <p className="text-3xl font-bold text-blue-500">{summary.totalFacilities}</p>
              </div>
            </div>
          )}

          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportCards.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                  <div className={'p-3 rounded-lg inline-block mb-4 ' + report.bgColor}>
                    <Icon className={'w-8 h-8 ' + report.color} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{report.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{report.description}</p>
                  <button
                    onClick={() => handleGenerateReport(report.id)}
                    disabled={generating === report.id}
                    className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {generating === report.id ? 'Generating...' : 'Download CSV'}
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
