'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { LayoutDashboard, Shield, AlertTriangle, Activity, Server, Bell, LogOut, Search, Plus } from 'lucide-react';
import Link from 'next/link';

export default function IncidentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<any[]>([]);
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

    const fetchIncidents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/incidents', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setIncidents(res.data);
        setFilteredIncidents(res.data);
      } catch (err) {
        console.error('Failed to fetch incidents', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [router]);

  useEffect(() => {
    const result = incidents.filter(inc => 
      inc.title.toLowerCase().includes(search.toLowerCase()) || 
      inc.category.toLowerCase().includes(search.toLowerCase()) ||
      inc.facility.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredIncidents(result);
  }, [search, incidents]);

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
          <a href="/security" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors"><Shield className="w-5 h-5 mr-3" /> Security</a>
          <Link href="/incidents" className="flex items-center px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
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
          <h1 className="text-xl font-semibold text-white">Incident Management</h1>
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
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">All Incidents ({filteredIncidents.length})</h2>
              <div className="flex items-center space-x-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Search incidents..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Incident Title</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Facility</th>
                    <th className="px-6 py-4 font-medium">Severity</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredIncidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{inc.title}</td>
                      <td className="px-6 py-4 text-slate-400">{inc.category}</td>
                      <td className="px-6 py-4 text-slate-400">{inc.facility.name}</td>
                      <td className="px-6 py-4">
                        <span className={
                          inc.severity === 'CRITICAL' ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs border border-red-400/20' : 
                          inc.severity === 'HIGH' ? 'text-orange-400 bg-orange-400/10 px-2 py-1 rounded text-xs border border-orange-400/20' :
                          'text-slate-400 bg-slate-800 px-2 py-1 rounded text-xs'
                        }>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={
                          inc.status === 'DETECTED' ? 'text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded text-xs border border-yellow-400/20' : 
                          inc.status === 'INVESTIGATING' ? 'text-blue-400 bg-blue-400/10 px-2 py-1 rounded text-xs border border-blue-400/20' :
                          'text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs border border-green-400/20'
                        }>
                          {inc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{new Date(inc.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {filteredIncidents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No incidents found. Make sure you ran the seed script.
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

