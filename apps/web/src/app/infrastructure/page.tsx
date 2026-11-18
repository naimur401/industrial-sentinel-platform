'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Server, Cpu, HardDrive, Network, CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';
import Link from 'next/link';

const statusStyles = {
  ONLINE: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle },
  DEGRADED: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: AlertTriangle },
  OFFLINE: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle },
};

export default function InfrastructurePage() {
  const router = useRouter();
  const [servers, setServers] = useState([]);
  const [stats, setStats] = useState({ total: 0, online: 0, degraded: 0, offline: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchData = async () => {
      try {
        const headers = { Authorization: 'Bearer ' + token };
        const [serversRes, statsRes] = await Promise.all([
          axios.get('http://localhost:3000/infrastructure/servers', { headers }),
          axios.get('http://localhost:3000/infrastructure/servers/stats', { headers }),
        ]);
        setServers(serversRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch infrastructure data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-slate-400 hover:text-white mr-4 transition-colors">
            Back
          </Link>
          <div className="flex items-center space-x-3"><h1 className="text-xl font-semibold text-white">Infrastructure Overview</h1><Link href="/infrastructure/network-health" className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors">Network Health</Link>
<Link href="/infrastructure/logs" className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-sm rounded-lg transition-colors">System Logs</Link></div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-sm text-slate-400 mb-1">Total Servers</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-sm text-slate-400 mb-1">Online</p>
            <p className="text-3xl font-bold text-green-500">{stats.online}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-sm text-slate-400 mb-1">Degraded</p>
            <p className="text-3xl font-bold text-yellow-500">{stats.degraded}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-sm text-slate-400 mb-1">Offline</p>
            <p className="text-3xl font-bold text-red-500">{stats.offline}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Server Inventory ({servers.length})</h2>
            <Link href="/infrastructure/servers" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
              View All Servers
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Hostname</th>
                  <th className="px-6 py-4 font-medium">IP Address</th>
                  <th className="px-6 py-4 font-medium">OS</th>
                  <th className="px-6 py-4 font-medium">Environment</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {servers.slice(0, 5).map((server) => {
                  const style = statusStyles[server.status] || statusStyles.OFFLINE;
                  const Icon = style.icon;
                  return (
                    <tr key={server.id} onClick={() => router.push('/infrastructure/servers/' + server.id)} className="hover:bg-slate-800/30 transition-colors cursor-pointer">
                      <td className="px-6 py-4 text-white font-medium flex items-center">
                        <Server className="w-4 h-4 mr-2 text-blue-400" /> {server.hostname}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{server.ipAddress}</td>
                      <td className="px-6 py-4 text-slate-400">{server.os}</td>
                      <td className="px-6 py-4 text-slate-400">{server.environment}</td>
                      <td className="px-6 py-4">
                        <span className={'inline-flex items-center px-2 py-1 rounded text-xs border ' + style.color + ' ' + style.bg + ' ' + style.border}>
                          <Icon className="w-3 h-3 mr-1" /> {server.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {servers.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No servers registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

