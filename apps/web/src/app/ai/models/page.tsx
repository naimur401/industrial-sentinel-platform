'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Brain, TrendingUp, Activity, Shield, Plus, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const typeIcons = {
  PREDICTIVE_MAINTENANCE: TrendingUp,
  ANOMALY_DETECTION: Activity,
  INTRUSION_DETECTION: Shield,
};

const typeColors = {
  PREDICTIVE_MAINTENANCE: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  ANOMALY_DETECTION: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  INTRUSION_DETECTION: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const statusColors = {
  DEPLOYED: 'text-green-400 bg-green-400/10 border-green-400/20',
  STAGED: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  TRAINING: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  RETIRED: 'text-slate-400 bg-slate-800 border-slate-700',
};

export default function ModelRegistryPage() {
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'PREDICTIVE_MAINTENANCE', version: 'v1.0', algorithm: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchModels = async () => {
    try {
      const token = Cookies.get('token');
      const res = await axios.get('http://localhost:3000/models', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setModels(res.data);
    } catch (err) {
      console.error('Failed to fetch models', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }
    fetchModels();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = Cookies.get('token');
      await axios.post('http://localhost:3000/models', formData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      await fetchModels();
      setShowForm(false);
      setFormData({ name: '', type: 'PREDICTIVE_MAINTENANCE', version: 'v1.0', algorithm: '', description: '' });
    } catch (err) {
      console.error('Failed to create model', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeploy = async (id) => {
    try {
      const token = Cookies.get('token');
      await axios.patch('http://localhost:3000/models/' + id + '/status', { status: 'DEPLOYED' }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      await fetchModels();
    } catch (err) {
      console.error('Failed to deploy model', err);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/ai" className="text-slate-400 hover:text-white mr-4 transition-colors">
            Back
          </Link>
          <h1 className="text-xl font-semibold text-white">Model Registry</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Register Model
        </button>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {models.map((model) => {
            const Icon = typeIcons[model.type] || Brain;
            return (
              <div key={model.id} onClick={() => router.push("/ai/models/" + model.id)} className="bg-slate-900 border border-slate-800 rounded-xl p-6 cursor-pointer hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={'p-3 rounded-lg border ' + typeColors[model.type]}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{model.name}</h3>
                      <p className="text-sm text-slate-400">{model.algorithm} - {model.version}</p>
                    </div>
                  </div>
                  <span className={'px-2 py-1 rounded text-xs border ' + statusColors[model.status]}>
                    {model.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4">{model.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Created: {new Date(model.createdAt).toLocaleDateString()}</span>
                  {model.status !== 'DEPLOYED' && (
                    <button onClick={() => handleDeploy(model.id)} className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs rounded-lg transition-colors">
                      <CheckCircle className="w-3 h-3 mr-1" /> Deploy
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {models.length === 0 && (
            <div className="col-span-full text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
              <Brain className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No models registered yet.</p>
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Register Model</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Model Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none">
                  <option value="PREDICTIVE_MAINTENANCE">Predictive Maintenance</option>
                  <option value="ANOMALY_DETECTION">Anomaly Detection</option>
                  <option value="INTRUSION_DETECTION">Intrusion Detection</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Algorithm</label>
                <input type="text" required value={formData.algorithm} onChange={(e) => setFormData({...formData, algorithm: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" placeholder="e.g. XGBoost" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Version</label>
                <input type="text" value={formData.version} onChange={(e) => setFormData({...formData, version: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50">
                  {submitting ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
