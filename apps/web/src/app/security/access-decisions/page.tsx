'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle, KeyRound, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const getDecisionStyle = (decision: string) => {
  switch (decision) {
    case 'ALLOW': return { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle };
    case 'DENY': return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle };
    case 'REQUIRE_MFA': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: KeyRound };
    case 'REQUIRE_VERIFICATION': return { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: AlertTriangle };
    default: return { color: 'text-slate-400', bg: 'bg-slate-800', border: 'border-slate-700', icon: Shield };
  }
};

const getRiskColor = (score: number) => {
  if (score >= 80) return 'bg-red-500';
  if (score >= 60) return 'bg-orange-500';
  if (score >= 30) return 'bg-yellow-500';
  return 'bg-green-500';
};

export default function AccessDecisionsPage() {
  const router = useRouter();
  const [decisions, setDecisions] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, allow: 0, deny: 0, requireMfa: 0, requireVerification: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchData = async () => {
      try {
        const headers = { Authorization: 'Bearer ' + token };
        const [decisionsRes, statsRes] = await Promise.all([
          axios.get('http://localhost:3000/zero-trust/decisions', { headers }),
          axios.get('http://localhost:3000/zero-trust/decisions/stats', { headers }),
        ]);
        setDecisions(decisionsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch access decisions', err);
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
          <Link href="/security/zero-trust" className="text-slate-400 hover:text-white mr-4 transition-colors">
            ? Back
          </Link>
          <h1 className="text-xl font-semibold text-white">Access Decisions</h1>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-slate-400">Allow</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.allow}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-sm text-slate-400">Deny</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.deny}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <KeyRound className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-sm text-slate-400">Require MFA</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.requireMfa}</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-sm text-slate-400">Require Verification</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.requireVerification}</p>
          </div>
        </div>

        {/* Decisions Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-medium text-white">Recent Access Decisions ({decisions.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Resource</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Risk Score</th>
                  <th className="px-6 py-4 font-medium">Decision</th>
                  <th className="px-6 py-4 font-medium">Reason</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {decisions.map((dec) => {
                  const style = getDecisionStyle(dec.decision);
                  const Icon = style.icon;
                  return (
                    <tr key={dec.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{dec.resource}</td>
                      <td className="px-6 py-4 text-slate-400">{dec.action}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className={'h-full ' + getRiskColor(dec.riskScore)} style={{ width: Math.min(dec.riskScore, 100) + '%' }}></div>
                          </div>
                          <span className="text-sm text-slate-300 font-mono">{dec.riskScore.toFixed(0)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={'inline-flex items-center px-2 py-1 rounded text-xs border ' + style.color + ' ' + style.bg + ' ' + style.border}>
                          <Icon className="w-3 h-3 mr-1" /> {dec.decision}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs max-w-xs truncate">{dec.reason || '-'}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{new Date(dec.createdAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
                {decisions.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No access decisions yet. Run an evaluation to get started.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
