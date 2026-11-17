'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, Shield, Plus, X, Check, AlertTriangle, ShieldCheck, ShieldX, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';

export default function ZeroTrustPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', resource: '', action: 'read' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: 'Bearer ' + token };
      const [policiesRes, decisionsRes] = await Promise.all([
        axios.get('http://localhost:3000/zero-trust/policies', { headers }),
        axios.get('http://localhost:3000/zero-trust/decisions', { headers }),
      ]);
      setPolicies(policiesRes.data);
      setDecisions(decisionsRes.data);
    } catch (err) {
      console.error('Failed to fetch zero-trust data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    if (!token) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
    fetchData();
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = Cookies.get('token');
      await axios.post('http://localhost:3000/zero-trust/policies', formData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      await fetchData();
      setShowForm(false);
      setFormData({ name: '', description: '', resource: '', action: 'read' });
    } catch (err) {
      console.error('Failed to create policy', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const token = Cookies.get('token');
      await axios.patch('http://localhost:3000/zero-trust/policies/' + id + '/toggle', {}, {
        headers: { Authorization: 'Bearer ' + token }
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to toggle policy', err);
    }
  };

  if (!user || loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/security" className="text-slate-400 hover:text-white mr-4 transition-colors">
            ? Back
          </Link>
          <div className="flex items-center space-x-3"><h1 className="text-xl font-semibold text-white">Zero Trust Policies</h1><Link href="/security/access-decisions" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">Access Decisions</Link><Link href="/security/device-trust" className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors">Device Trust</Link></div>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Policy
        </button>
      </header>

      <main className="p-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-medium text-white">Access Policies ({policies.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Resource</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{policy.name}</td>
                    <td className="px-6 py-4 text-slate-400">{policy.resource}</td>
                    <td className="px-6 py-4 text-slate-400">{policy.action}</td>
                    <td className="px-6 py-4">
                      <span className={policy.enabled ? 'text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs border border-green-400/20' : 'text-slate-500 bg-slate-800 px-2 py-1 rounded text-xs'}>
                        {policy.enabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleToggle(policy.id)} className={policy.enabled ? 'text-green-400 hover:text-green-300' : 'text-slate-500 hover:text-slate-400'}>
                        {policy.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>
                    </td>
                  </tr>
                ))}
                {policies.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No policies yet. Create one!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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
                  <th className="px-6 py-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {decisions.map((dec) => (
                  <tr key={dec.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-white">{dec.resource}</td>
                    <td className="px-6 py-4 text-slate-400">{dec.action}</td>
                    <td className="px-6 py-4 text-slate-400">{dec.riskScore.toFixed(0)}</td>
                    <td className="px-6 py-4">
                      <span className={
                        dec.decision === 'ALLOW' ? 'text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs border border-green-400/20' :
                        dec.decision === 'DENY' ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs border border-red-400/20' :
                        'text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded text-xs border border-yellow-400/20'
                      }>{dec.decision}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{new Date(dec.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
                {decisions.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No access decisions yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Add Access Policy</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Policy Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" placeholder="e.g. Admin Asset Access" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Resource</label>
                <select value={formData.resource} onChange={(e) => setFormData({...formData, resource: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" required>
                  <option value="">Select Resource</option>
                  <option value="asset">Asset</option>
                  <option value="incident">Incident</option>
                  <option value="user">User</option>
                  <option value="report">Report</option>
                  <option value="facility">Facility</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Action</label>
                <select value={formData.action} onChange={(e) => setFormData({...formData, action: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none">
                  <option value="read">Read</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


