'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { LayoutDashboard, Shield, AlertTriangle, Activity, Server, Bell, LogOut, UserPlus, KeyRound, Building2, FileText, Wrench, Plus } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

const assetHealthData = [
  { name: 'Mon', health: 85 },
  { name: 'Tue', health: 88 },
  { name: 'Wed', health: 82 },
  { name: 'Thu', health: 90 },
  { name: 'Fri', health: 78 },
  { name: 'Sat', health: 85 },
  { name: 'Sun', health: 92 },
];

const threatActivityData = [
  { name: 'Mon', threats: 12 },
  { name: 'Tue', threats: 19 },
  { name: 'Wed', threats: 8 },
  { name: 'Thu', threats: 25 },
  { name: 'Fri', threats: 14 },
  { name: 'Sat', threats: 7 },
  { name: 'Sun', threats: 10 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ totalAssets: 0, totalFacilities: 0 });
  const [criticalityData, setCriticalityData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any>({ incidents: [], threats: [], maintenance: [] });
  const [aiRisk, setAiRisk] = useState<any>({ avgRUL: 0, highRiskCount: 0, totalPredictions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) setUser(JSON.parse(userData));

    const fetchData = async () => {
      try {
        const headers = { Authorization: 'Bearer ' + token };
        const [statsRes, critRes, activityRes, aiRes] = await Promise.all([
          axios.get('http://localhost:3000/assets/stats', { headers }),
          axios.get('http://localhost:3000/assets/criticality-distribution', { headers }),
          axios.get('http://localhost:3000/assets/recent-activity', { headers }),
          axios.get('http://localhost:3000/assets/ai-risk-summary', { headers }),
        ]);
        
        setStats(statsRes.data);
        setCriticalityData(critRes.data.map((d: any) => ({ name: d.criticality, value: d._count })));
        setRecentActivity(activityRes.data);
        setAiRisk(aiRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  if (!user || loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading dashboard...</div>;

  const timeline: any[] = [];
  recentActivity.incidents?.forEach((i: any) => timeline.push({ 
    type: 'incident', title: i.title, severity: i.severity, time: i.createdAt, icon: AlertTriangle, color: 'text-yellow-400' 
  }));
  recentActivity.threats?.forEach((t: any) => timeline.push({ 
    type: 'threat', title: t.eventType, severity: t.severity, time: t.createdAt, icon: Shield, color: 'text-red-400' 
  }));
  recentActivity.maintenance?.forEach((m: any) => timeline.push({ 
    type: 'maintenance', title: m.title, severity: m.priority, time: m.createdAt, icon: Wrench, color: 'text-blue-400' 
  }));
  timeline.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  const recentTimeline = timeline.slice(0, 5);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Shield className="w-8 h-8 text-blue-500 mr-3" />
          <span className="text-white font-bold text-lg tracking-tight">Sentinel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
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
          <Link href="/maintenance" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Wrench className="w-5 h-5 mr-3" /> Maintenance
          </Link>
          <Link href="/notifications" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5 mr-3" /> Notifications
          </Link>
          <Link href="/reports" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
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
          <h1 className="text-xl font-semibold text-white">Executive Overview</h1>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-white">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Total Facilities</p>
              <p className="text-3xl font-bold text-white">{stats.totalFacilities}</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Total Assets</p>
              <p className="text-3xl font-bold text-white">{stats.totalAssets}</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Avg Asset RUL</p>
              <p className="text-3xl font-bold text-blue-400">{aiRisk.avgRUL} <span className="text-sm">days</span></p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">High Risk Assets</p>
              <p className="text-3xl font-bold text-red-500">{aiRisk.highRiskCount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 h-80 flex flex-col">
              <h2 className="text-lg font-medium text-white mb-4">Asset Health Trends</h2>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={assetHealthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                    <Line type="monotone" dataKey="health" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 h-80 flex flex-col">
              <h2 className="text-lg font-medium text-white mb-4">Threat Activity</h2>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={threatActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} cursor={{ fill: '#1e293b' }} />
                    <Bar dataKey="threats" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 h-80 flex flex-col">
              <h2 className="text-lg font-medium text-white mb-4">Asset Criticality</h2>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={criticalityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {criticalityData.map((entry, index) => (
                        <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 bg-slate-900 rounded-xl border border-slate-800">
              <h2 className="text-lg font-medium text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentTimeline.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                      <div className={'p-2 rounded-lg ' + (item.type === 'threat' ? 'bg-red-500/10' : item.type === 'incident' ? 'bg-yellow-500/10' : 'bg-blue-500/10')}>
                        <Icon className={'w-4 h-4 ' + item.color} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{item.title}</p>
                        <p className="text-xs text-slate-500">{new Date(item.time).toLocaleString()}</p>
                      </div>
                      <span className={
                        item.severity === 'CRITICAL' ? 'text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs border border-red-400/20' :
                        item.severity === 'HIGH' ? 'text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded text-xs border border-orange-400/20' :
                        'text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-xs'
                      }>
                        {item.severity}
                      </span>
                    </div>
                  );
                })}
                {recentTimeline.length === 0 && (
                  <p className="text-center text-slate-500 py-4">No recent activity</p>
                )}
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/assets/add" className="flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                  <Plus className="w-4 h-4 mr-2" /> Add New Asset
                </Link>
                <Link href="/maintenance" className="flex items-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  <Wrench className="w-4 h-4 mr-2" /> Create Work Order
                </Link>
                <Link href="/incidents" className="flex items-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  <AlertTriangle className="w-4 h-4 mr-2" /> View Incidents
                </Link>
                <Link href="/security/threats" className="flex items-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  <Shield className="w-4 h-4 mr-2" /> View Threats
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

