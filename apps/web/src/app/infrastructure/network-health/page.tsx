'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, Network, Activity, Clock, AlertTriangle, Wifi, Gauge } from 'lucide-react';
import Link from 'next/link';

const statusColors = {
  UP: 'text-green-400 bg-green-400/10 border-green-400/20',
  DEGRADED: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  DOWN: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function NetworkHealthPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/infrastructure/network-health', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch network health', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!data) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">No data available</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6">
        <Link href="/infrastructure" className="text-slate-400 hover:text-white mr-4 transition-colors">
          Back
        </Link>
        <h1 className="text-xl font-semibold text-white">Network Health</h1>
      </header>

      <main className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Gauge className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-slate-400">Avg Bandwidth</p>
            </div>
            <p className="text-3xl font-bold text-white">{data.summary.avgBandwidth} <span className="text-sm text-slate-500">Mbps</span></p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-sm text-slate-400">Avg Latency</p>
            </div>
            <p className="text-3xl font-bold text-white">{data.summary.avgLatency} <span className="text-sm text-slate-500">ms</span></p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-sm text-slate-400">Packet Loss</p>
            </div>
            <p className="text-3xl font-bold text-white">{data.summary.packetLoss} <span className="text-sm text-slate-500">%</span></p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Wifi className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-slate-400">Network Uptime</p>
            </div>
            <p className="text-3xl font-bold text-white">{data.summary.uptime} <span className="text-sm text-slate-500">%</span></p>
          </div>
        </div>

        {/* Interface Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-medium text-white flex items-center">
              <Network className="w-5 h-5 mr-2" /> Interface Status
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Server</th>
                  <th className="px-6 py-4 font-medium">IP Address</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Bandwidth</th>
                  <th className="px-6 py-4 font-medium">Latency</th>
                  <th className="px-6 py-4 font-medium">Packet Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.interfaces.map((iface, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{iface.server}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{iface.ip}</td>
                    <td className="px-6 py-4">
                      <span className={'inline-flex items-center px-2 py-1 rounded text-xs border ' + statusColors[iface.status]}>
                        {iface.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{iface.bandwidth} Mbps</td>
                    <td className="px-6 py-4 text-slate-300">{iface.latency} ms</td>
                    <td className="px-6 py-4 text-slate-300">{iface.packetLoss}%</td>
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