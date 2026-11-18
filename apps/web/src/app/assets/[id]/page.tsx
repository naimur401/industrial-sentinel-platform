'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, Activity, MapPin, AlertTriangle, CheckCircle, Edit } from 'lucide-react';

export default function AssetDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchAsset = async () => {
      try {
        const res = await axios.get('http://localhost:3000/assets/' + params.id, {
          headers: { Authorization: 'Bearer ' + token }
        });
        setAsset(res.data);
      } catch (err) {
        console.error('Failed to fetch asset', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchAsset();
  }, [params.id, router]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading asset details...</div>;
  if (!asset) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Asset not found</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 flex justify-center items-start pt-20">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <button onClick={() => router.back()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors mt-1">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{asset.name}</h1>
                <span className={asset.criticality === 'CRITICAL' ? 'text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs border border-red-400/20' : 'text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-xs'}>
                  {asset.criticality}
                </span>
              </div>
              <p className="text-slate-400">Type: {asset.type} • ID: {asset.id.split('-')[0]}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.push('/assets/' + asset.id + '/edit')}
              className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </button>
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-400/10 border border-green-400/20 rounded-lg text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{asset.status}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Facility</p>
              <p className="text-white font-medium">{asset.facility.name}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Location</p>
              <p className="text-white font-medium">{asset.location || 'Not set'}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Installation Date</p>
              <p className="text-white font-medium">{asset.installationDate ? new Date(asset.installationDate).toLocaleDateString() : 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Placeholder for Sensor Data & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-64 flex flex-col">
            <h2 className="text-lg font-medium text-white mb-4">Sensor Readings</h2>
            <div className="flex-1 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
              No sensor data available yet
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-64 flex flex-col">
            <h2 className="text-lg font-medium text-white mb-4">AI Health Prediction</h2>
            <div className="flex-1 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
              AI model not connected yet
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}