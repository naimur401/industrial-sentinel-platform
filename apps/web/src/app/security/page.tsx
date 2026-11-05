'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { LayoutDashboard, Shield, AlertTriangle, Activity, Server, Bell, LogOut, Search } from 'lucide-react';
import Link from 'next/link';

export default function SecurityOverviewPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [threats, setThreats] = useState<any[]>([]);
  const [filteredThreats, setFilteredThreats] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalThreats: 0, criticalThreats: 0, activeThreats: 0 });
  const [search, setSearch] = useState('');
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
        const [threatsRes, statsRes] = await Promise.all([
          axios.get('http://localhost:3000/security/threats', { headers: { Authorization: 'Bearer ' + token } }),
          axios.get('http://localhost:3000/security/stats', { headers: { Authorization: 'Bearer ' + token } })
        ]);
        setThreats(threatsRes.data);
        setFilteredThreats(threatsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch security data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    const result = threats.filter(t => 
      t.eventType.toLowerCase().includes(search.toLowerCase()) || 
      t.sourceIp.toLowerCase().includes(search.toLowerCase()) ||
      t.destinationIp.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredThreats(result);
  }, [search, threats]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  if (!user || loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Shield className="w-8 h-8 text-blue-500 mr-3" />
          <span className="text-white font-bold text-lg tracking-tight">Sentinel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Overview
          </Link>
          <Link href="/assets" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Server className="w-5 h-5 mr-3" /> Assets
          </Link>
          <Link href="/ai" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Activity className="w-5 h-5 mr-3" /> AI Intelligence
          </Link>
          <Link href="/security" className="flex items-center px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <Shield className="w-5 h-5 mr-3" /> Security
          </Link>
          <Link href="/incidents" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <AlertTriangle className="w-5 h-5 mr-3" /> Incidents
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-white">Security Overview</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Total Threats</p>
              <p className="text-3xl font-bold text-white">{stats.totalThreats}</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Critical Threats</p>
              <p className="text-3xl font-bold text-red-500">{stats.criticalThreats}</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Active Investigations</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.activeThreats}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Recent Threat Events</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Search threats..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Event Type</th>
                    <th className="px-6 py-4 font-medium">Source IP</th>
                    <th className="px-6 py-4 font-medium">Destination IP</th>
                    <th className="px-6 py-4 font-medium">Severity</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredThreats.map((threat) => (
                    <tr key={threat.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{threat.eventType}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{threat.sourceIp}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{threat.destinationIp}</td>
                      <td className="px-6 py-4">
                        <span className={
                          threat.severity === 'CRITICAL' ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs border border-red-400/20' : 
                          threat.severity === 'HIGH' ? 'text-orange-400 bg-orange-400/10 px-2 py-1 rounded text-xs border border-orange-400/20' :
                          'text-slate-400 bg-slate-800 px-2 py-1 rounded text-xs'
                        }>
                          {threat.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={
                          threat.status === 'NEW' ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs border border-red-400/20' : 
                          threat.status === 'INVESTIGATING' ? 'text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded text-xs border border-yellow-400/20' :
                          'text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs border border-green-400/20'
                        }>
                          {threat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{new Date(threat.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {filteredThreats.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No threats found. Make sure you ran the seed script.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
