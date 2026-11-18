'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, BarChart3, TrendingUp, AlertTriangle, DollarSign, PieChart as PieIcon, Activity } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#a855f7'];

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const [assetHealth, setAssetHealth] = useState(null);
  const [incidentStats, setIncidentStats] = useState(null);
  const [threatTrend, setThreatTrend] = useState([]);
  const [maintenanceCosts, setMaintenanceCosts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchData = async () => {
      try {
        const headers = { Authorization: 'Bearer ' + token };
        const [ahRes, isRes, ttRes, mcRes] = await Promise.all([
          axios.get('http://localhost:3000/analytics/asset-health', { headers }),
          axios.get('http://localhost:3000/analytics/incident-stats', { headers }),
          axios.get('http://localhost:3000/analytics/threat-trend', { headers }),
          axios.get('http://localhost:3000/analytics/maintenance-costs', { headers }),
        ]);
        setAssetHealth(ahRes.data);
        setIncidentStats(isRes.data);
        setThreatTrend(ttRes.data);
        setMaintenanceCosts(mcRes.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  const healthData = assetHealth ? [
    { name: 'Healthy', value: assetHealth.healthy },
    { name: 'At Risk', value: assetHealth.atRisk },
    { name: 'Critical', value: assetHealth.critical },
  ] : [];

  const severityData = incidentStats?.bySeverity?.map((s) => ({ name: s.severity, value: s._count })) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6">
        <Link href="/dashboard" className="text-slate-400 hover:text-white mr-4 transition-colors">
          Back
        </Link>
        <h1 className="text-xl font-semibold text-white">Analytics Dashboard</h1>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-slate-400">Healthy Assets</p>
            </div>
            <p className="text-3xl font-bold text-white">{assetHealth?.healthy || 0}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-sm text-slate-400">At Risk</p>
            </div>
            <p className="text-3xl font-bold text-white">{assetHealth?.atRisk || 0}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-sm text-slate-400">Critical</p>
            </div>
            <p className="text-3xl font-bold text-white">{assetHealth?.critical || 0}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-slate-400">Maintenance Cost</p>
            </div>
            <p className="text-3xl font-bold text-white">${maintenanceCosts?.totalCost || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 h-96 flex flex-col">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" /> Threat Trend (7 Days)
            </h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={threatTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(t) => new Date(t).toLocaleDateString('en', { weekday: 'short' })} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                  <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 h-96 flex flex-col">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <PieIcon className="w-5 h-5 mr-2" /> Asset Health Distribution
            </h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={healthData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {healthData.map((entry, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 h-96 flex flex-col">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" /> Incidents by Severity
            </h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} cursor={{ fill: '#1e293b' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 h-96 flex flex-col">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" /> Maintenance Overview
            </h2>
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Total Work Orders</span>
                <span className="text-2xl font-bold text-white">{maintenanceCosts?.totalOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Completed</span>
                <span className="text-2xl font-bold text-green-400">{maintenanceCosts?.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Avg Cost per Order</span>
                <span className="text-2xl font-bold text-blue-400">${maintenanceCosts?.avgCost || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}