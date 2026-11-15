'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, Shield, AlertTriangle, Activity, Save, Network, Server, Clock, CheckCircle, X } from 'lucide-react';

export default function ThreatDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [threat, setThreat] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  const showToast = (type: string, message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const fetchThreat = async () => {
    try {
      const token = Cookies.get('token');
      const res = await axios.get('http://localhost:3000/security/threats/' + params.id, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setThreat(res.data);
      setNotes(res.data.description || '');
    } catch (err) {
      console.error('Failed to fetch threat', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }
    if (params.id) fetchThreat();
  }, [params.id, router]);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const token = Cookies.get('token');
      await axios.patch('http://localhost:3000/security/threats/' + params.id + '/notes',
        { notes },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      await fetchThreat();
      showToast('success', 'Investigation notes saved successfully!');
    } catch (err) {
      console.error('Failed to save notes', err);
      showToast('error', 'Failed to save notes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const token = Cookies.get('token');
      await axios.patch('http://localhost:3000/security/threats/' + params.id + '/status',
        { status: newStatus },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      await fetchThreat();
      showToast('success', 'Status updated to ' + newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
      showToast('error', 'Failed to update status.');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!threat) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Threat not found</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 flex justify-center items-start pt-10">
      <div className="w-full max-w-4xl space-y-6">
        
        {toast.show && (
          <div className={'fixed top-6 right-6 z-50 flex items-center px-4 py-3 rounded-lg shadow-lg border ' + (toast.type === 'success' ? 'bg-green-900/50 border-green-500/50 text-green-400' : 'bg-red-900/50 border-red-500/50 text-red-400')}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <X className="w-5 h-5 mr-2" />}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast({ show: false, type: '', message: '' })} className="ml-4 text-current opacity-70 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <button onClick={() => router.back()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors mt-1">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">{threat.eventType}</h1>
                  <span className={
                    threat.severity === 'CRITICAL' ? 'text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs border border-red-400/20' :
                    threat.severity === 'HIGH' ? 'text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded text-xs border border-orange-400/20' :
                    'text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded text-xs border border-yellow-400/20'
                  }>{threat.severity}</span>
                </div>
                <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center"><Network className="w-4 h-4 mr-1" /> Source: {threat.sourceIp}</span>
                  <span className="flex items-center"><Server className="w-4 h-4 mr-1" /> Destination: {threat.destinationIp}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {new Date(threat.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <select 
              value={threat.status} 
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white outline-none"
            >
              <option value="NEW">New</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="RESOLVED">Resolved</option>
              <option value="FALSE_POSITIVE">False Positive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Source IP</p>
            <p className="text-white font-mono text-sm">{threat.sourceIp}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Destination IP</p>
            <p className="text-white font-mono text-sm">{threat.destinationIp}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Status</p>
            <p className="text-white text-sm">{threat.status}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" /> Investigation Notes
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your investigation notes here..."
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" /> Evidence Details
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Event Type</span>
              <span className="text-white">{threat.eventType}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Detection Source</span>
              <span className="text-white">IDS (Suricata Simulation)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Classification</span>
              <span className="text-white">{threat.severity} Severity Threat</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Timestamp</span>
              <span className="text-white">{new Date(threat.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
