'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, Network, AlertTriangle, Activity, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#a855f7', '#eab308', '#64748b'];

export default function NetworkMonitoringPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/security/network-monitoring', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch network monitoring data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!data) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">No data available</div>;

  const protocolData = data.protocols.map(p => ({ name: p.protocol, value: p.percentage }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6">
        <Link href="/security" className="text-slate-400 hover:text-white mr-4 transition-colors">
          Back
        </Link>
        <h1 className="text-xl font-semibold text-white">Network Monitoring</h1>
      </header>

      <main className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Network className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-slate-400">Total Connections</p>
            </div>
            <p className="text-3xl font-bold text-white">{data.summary.totalConnections}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-slate-400">Active Connections</p>
            </div>
            <p className="text-3xl font-bold text-white">{data.summary.activeConnections}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-sm text-slate-400">Blocked Requests</p>
            </div>
            <p className="text-3xl font-bold text-white">{data.summary.blockedRequests}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-sm text-slate-400">Bandwidth Usage</p>
            </div>
            <p className="text-3xl font-bold text-white">{data.summary.bandwidthUsage}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic History Chart */}
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 h-96 flex flex-col">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" /> Network Traffic (24h)
            </h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trafficHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                  <Line type="monotone" dataKey="inbound" stroke="#3b82f6" name="Inbound (Mbps)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="outbound" stroke="#a855f7" name="Outbound (Mbps)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Protocol Distribution */}
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 h-96 flex flex-col">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2" /> Protocol Distribution
            </h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={protocolData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {protocolData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Suspicious Activity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-medium text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" /> Suspicious Activity
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.suspiciousActivity.map((activity, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">{activity.source}</td>
                    <td className="px-6 py-4 text-white font-medium">{activity.type}</td>
                    <td className="px-6 py-4">
                      <span className={
                        activity.severity === 'CRITICAL' ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs border border-red-400/20' :
                        activity.severity === 'HIGH' ? 'text-orange-400 bg-orange-400/10 px-2 py-1 rounded text-xs border border-orange-400/20' :
                        'text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded text-xs border border-yellow-400/20'
                      }>
                        {activity.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(activity.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}