'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, Server, CheckCircle, AlertTriangle, XCircle, Search } from 'lucide-react';
import Link from 'next/link';

const statusStyles = {
  ONLINE: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle },
  DEGRADED: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: AlertTriangle },
  OFFLINE: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle },
};

export default function ServerListPage() {
  const router = useRouter();
  const [servers, setServers] = useState([]);
  const [filteredServers, setFilteredServers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchServers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/infrastructure/servers', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setServers(res.data);
        setFilteredServers(res.data);
      } catch (err) {
        console.error('Failed to fetch servers', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [router]);

  useEffect(() => {
    const result = servers.filter(s => 
      s.hostname.toLowerCase().includes(search.toLowerCase()) ||
      s.ipAddress.includes(search) ||
      s.os.toLowerCase().includes(search.toLowerCase()) ||
      s.environment.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredServers(result);
  }, [search, servers]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/infrastructure" className="text-slate-400 hover:text-white mr-4 transition-colors">
            Back
          </Link>
          <h1 className="text-xl font-semibold text-white">Server Inventory</h1>
        </div>
      </header>

      <main className="p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">All Servers ({filteredServers.length})</h2>
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search servers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
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
                {filteredServers.map((server) => {
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
                {filteredServers.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No servers match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}