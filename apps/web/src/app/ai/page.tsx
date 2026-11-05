'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { LayoutDashboard, Shield, AlertTriangle, Activity, Server, Bell, LogOut, Cpu, BrainCircuit, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AIOverviewPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) setUser(JSON.parse(userData));

    const fetchPredictions = async () => {
      try {
        const res = await axios.get('http://localhost:3000/ai/predictions', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setPredictions(res.data);
      } catch (err) {
        console.error('Failed to fetch predictions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  if (!user || loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading AI data...</div>;

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
          <Link href="/ai" className="flex items-center px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <Activity className="w-5 h-5 mr-3" /> AI Intelligence
          </Link>
          <a href="/security" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors"><Shield className="w-5 h-5 mr-3" /> Security</a>
          <a href="/incidents" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors"><AlertTriangle className="w-5 h-5 mr-3" /> Incidents</a>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-white">AI Intelligence Overview</h1>
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
          {/* AI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Active Models</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Cpu className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Predictions</p>
                <p className="text-2xl font-bold text-white">{predictions.length}</p>
              </div>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Model Health</p>
                <p className="text-2xl font-bold text-white">98.5%</p>
              </div>
            </div>
          </div>

          {/* Latest Predictions Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Latest AI Predictions</h2>
              <Link href="/ai/predictive-maintenance" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                View Predictive Maintenance
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Asset</th>
                    <th className="px-6 py-4 font-medium">Remaining Useful Life</th>
                    <th className="px-6 py-4 font-medium">Failure Probability</th>
                    <th className="px-6 py-4 font-medium">Recommendation</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {predictions.map((pred) => (
                    <tr key={pred.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{pred.asset.name}</td>
                      <td className="px-6 py-4 text-slate-400">{pred.remainingUsefulLife} days</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className={'h-full ' + (pred.failureProbability > 0.6 ? 'bg-red-500' : 'bg-green-500')} style={{ width: (pred.failureProbability * 100) + '%' }}></div>
                          </div>
                          <span className="text-slate-400">{(pred.failureProbability * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{pred.recommendation}</td>
                      <td className="px-6 py-4 text-slate-400">{new Date(pred.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {predictions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        No AI predictions yet. Go to Predictive Maintenance to generate some.
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

