'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, Brain, TrendingUp, Activity, Shield, CheckCircle, Clock, Cpu, BarChart3, Database, Calendar } from 'lucide-react';

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

export default function ModelDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchModel = async () => {
      try {
        const res = await axios.get('http://localhost:3000/models/' + params.id, {
          headers: { Authorization: 'Bearer ' + token }
        });
        setModel(res.data);
      } catch (err) {
        console.error('Failed to fetch model', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchModel();
  }, [params.id, router]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!model) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Model not found</div>;

  const metrics = model.metricsJson || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 flex justify-center items-start pt-10">
      <div className="w-full max-w-4xl space-y-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <button onClick={() => router.back()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors mt-1">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">{model.name}</h1>
                  <span className={'px-2 py-1 rounded text-xs border ' + statusColors[model.status]}>
                    {model.status}
                  </span>
                  <button 
                    onClick={() => router.push('/ai/models/' + model.id + '/evaluation')} 
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors ml-2"
                  >
                    View Evaluation
                  </button>
                </div>
                <p className="text-slate-400">{model.description}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center"><Cpu className="w-4 h-4 mr-1" /> {model.algorithm}</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(model.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center"><Database className="w-4 h-4 mr-1" /> {model.version}</span>
                </div>
              </div>
            </div>
            <div className={'p-3 rounded-lg border ' + typeColors[model.type]}>
              <Brain className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" /> Model Metrics
          </h2>
          {Object.keys(metrics).length === 0 ? (
            <p className="text-center text-slate-500 py-4">No metrics available for this model.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase mb-1">{key}</p>
                  <p className="text-xl font-bold text-white">{typeof value === 'number' ? value.toFixed(2) : String(value)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" /> Model Metadata
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Model ID</span>
              <span className="text-white font-mono text-xs">{model.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Model Type</span>
              <span className="text-white">{model.type.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Version</span>
              <span className="text-white">{model.version}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Algorithm</span>
              <span className="text-white">{model.algorithm}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Last Updated</span>
              <span className="text-white">{new Date(model.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}