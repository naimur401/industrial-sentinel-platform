'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, Server, CheckCircle, AlertTriangle, XCircle, Cpu, HardDrive, Network, Activity, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statusStyles = {
  ONLINE: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle },
  DEGRADED: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: AlertTriangle },
  OFFLINE: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle },
};

export default function ServerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchServer = async () => {
      try {
        const res = await axios.get('http://localhost:3000/infrastructure/servers/' + params.id, {
          headers: { Authorization: 'Bearer ' + token }
        });
        setServer(res.data);
      } catch (err) {
        console.error('Failed to fetch server details', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchServer();
  }, [params.id, router]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!server) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Server not found</div>;

  const style = statusStyles[server.status] || statusStyles.OFFLINE;
  const StatusIcon = style.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 flex justify-center items-start pt-10">
      <div className="w-full max-w-5xl space-y-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <button onClick={() => router.back()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors mt-1">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{server.hostname}</h1>
                <span className={'inline-flex items-center px-2 py-1 rounded text-xs border ' + style.color + ' ' + style.bg + ' ' + style.border}>
                  <StatusIcon className="w-3 h-3 mr-1" /> {server.status}
                </span>
              </div>
              <p className="text-slate-400">IP: {server.ipAddress} | OS: {server.os} | Env: {server.environment}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" /> Resource Utilization (24h)
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={server.metrics || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={12} tickFormatter={(t) => new Date(t).getHours() + ':00'} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} labelFormatter={(l) => new Date(l).toLocaleString()} />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU %" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="memory" stroke="#a855f7" name="Memory %" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="disk" stroke="#f59e0b" name="Disk %" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Cpu className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">CPU Usage</p>
              <p className="text-xl font-bold text-white">{server.metrics?.length > 0 ? server.metrics[server.metrics.length - 1].cpu.toFixed(1) : '0'}%</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Memory Usage</p>
              <p className="text-xl font-bold text-white">{server.metrics?.length > 0 ? server.metrics[server.metrics.length - 1].memory.toFixed(1) : '0'}%</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <HardDrive className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Disk Usage</p>
              <p className="text-xl font-bold text-white">{server.metrics?.length > 0 ? server.metrics[server.metrics.length - 1].disk.toFixed(1) : '0'}%</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}