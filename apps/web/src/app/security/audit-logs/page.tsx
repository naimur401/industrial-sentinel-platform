'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Shield, CheckCircle, AlertTriangle, FileText, Hash, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [integrity, setIntegrity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchLogs = async () => {
      try {
        const headers = { Authorization: 'Bearer ' + token };
        const res = await axios.get('http://localhost:3000/audit/logs', { headers });
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [router]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const token = Cookies.get('token');
      const res = await axios.get('http://localhost:3000/audit/verify', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setIntegrity(res.data);
    } catch (err) {
      console.error('Failed to verify', err);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/security" className="text-slate-400 hover:text-white mr-4 transition-colors">
            ? Back
          </Link>
          <h1 className="text-xl font-semibold text-white">Audit Logs (Hash Chain)</h1>
        </div>
        <button onClick={handleVerify} disabled={verifying} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
          <Shield className="w-4 h-4 mr-2" /> {verifying ? 'Verifying...' : 'Verify Integrity'}
        </button>
      </header>

      <main className="p-6 space-y-6">
        {integrity && (
          <div className={'p-4 rounded-xl border ' + (integrity.valid ? 'bg-green-900/20 border-green-500/50' : 'bg-red-900/20 border-red-500/50')}>
            <div className="flex items-center space-x-3">
              {integrity.valid ? <CheckCircle className="w-6 h-6 text-green-400" /> : <AlertTriangle className="w-6 h-6 text-red-400" />}
              <div>
                <p className={'font-medium ' + (integrity.valid ? 'text-green-400' : 'text-red-400')}>
                  {integrity.valid ? 'Audit Log Integrity Verified' : 'Tampering Detected!'}
                </p>
                <p className="text-sm text-slate-400">
                  Total Logs: {integrity.total} | Tampered: {integrity.tamperedCount}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-medium text-white">Recent Audit Logs ({logs.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Resource</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                  <th className="px-4 py-3 font-medium">Hash</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{log.action}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{log.resource}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{log.details || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <Hash className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-mono text-blue-400">{log.entryHash.substring(0, 12)}...</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No audit logs yet. Create some actions!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
