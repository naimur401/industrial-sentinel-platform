'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Search, Info, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

const severityStyles = {
  INFO: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: Info },
  WARN: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: AlertTriangle },
  ERROR: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: AlertCircle },
  CRITICAL: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
};

export default function SystemLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:3000/infrastructure/system-logs', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setLogs(res.data);
        setFilteredLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [router]);

  useEffect(() => {
    let result = logs;
    if (search) {
      result = result.filter(l => 
        l.message.toLowerCase().includes(search.toLowerCase()) ||
        l.service.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (severityFilter !== 'ALL') {
      result = result.filter(l => l.severity === severityFilter);
    }
    setFilteredLogs(result);
  }, [search, severityFilter, logs]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6">
        <Link href="/infrastructure" className="text-slate-400 hover:text-white mr-4 transition-colors">
          Back
        </Link>
        <h1 className="text-xl font-semibold text-white">System Logs</h1>
      </header>

      <main className="p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Application Logs ({filteredLogs.length})</h2>
            <div className="flex items-center space-x-3">
              <select 
                value={severityFilter} 
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white outline-none"
              >
                <option value="ALL">All Severity</option>
                <option value="INFO">Info</option>
                <option value="WARN">Warning</option>
                <option value="ERROR">Error</option>
                <option value="CRITICAL">Critical</option>
              </select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white outline-none" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Message</th>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredLogs.map((log) => {
                  const style = severityStyles[log.severity] || severityStyles.INFO;
                  const Icon = style.icon;
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className={'inline-flex items-center px-2 py-1 rounded text-xs border ' + style.color + ' ' + style.bg + ' ' + style.border}>
                          <Icon className="w-3 h-3 mr-1" /> {log.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{log.service}</td>
                      <td className="px-6 py-4 text-slate-300">{log.message}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  );
                })}
                {filteredLogs.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No logs found matching your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}