'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditAssetPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'PUMP',
    criticality: 'MEDIUM',
    status: 'OPERATIONAL',
    location: '',
    installationDate: '',
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchAsset = async () => {
      try {
        const res = await axios.get('http://localhost:3000/assets/' + params.id, {
          headers: { Authorization: 'Bearer ' + token }
        });
        const asset = res.data;
        setFormData({
          name: asset.name,
          type: asset.type,
          criticality: asset.criticality,
          status: asset.status,
          location: asset.location || '',
          installationDate: asset.installationDate ? asset.installationDate.split('T')[0] : '',
        });
      } catch (err) {
        console.error('Failed to fetch asset', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchAsset();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = Cookies.get('token');
      await axios.patch('http://localhost:3000/assets/' + params.id, formData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      router.push('/assets/' + params.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update asset');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 flex justify-center items-start pt-10">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center">
          <button onClick={() => router.back()} className="mr-4 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-white">Edit Asset</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg">{error}</div>}

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-2">Asset Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Asset Type</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none">
                <option value="PUMP">Pump</option>
                <option value="MOTOR">Motor</option>
                <option value="COMPRESSOR">Compressor</option>
                <option value="TANK">Tank</option>
                <option value="PIPELINE">Pipeline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Criticality</label>
              <select value={formData.criticality} onChange={(e) => setFormData({...formData, criticality: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none">
                <option value="OPERATIONAL">Operational</option>
                <option value="DEGRADED">Degraded</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OFFLINE">Offline</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-2">Installation Date</label>
              <input type="date" value={formData.installationDate} onChange={(e) => setFormData({...formData, installationDate: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button type="submit" disabled={submitting} className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
              <Save className="w-5 h-5 mr-2" />
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}