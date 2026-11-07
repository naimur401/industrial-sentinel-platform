'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function SensorDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const [sensor, setSensor] = useState<any>(null);
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchSensor = async () => {
      try {
        const res = await axios.get('http://localhost:3000/sensors', {
          headers: { Authorization: 'Bearer ' + token }
        });
        const foundSensor = res.data.find((s: any) => s.id === params.id);
        setSensor(foundSensor);

        if (foundSensor) {
          const readingsRes = await axios.get('http://localhost:3000/sensors/' + foundSensor.id + '/readings', {
            headers: { Authorization: 'Bearer ' + token }
          });
          setReadings(readingsRes.data.reverse());
        }
      } catch (err) {
        console.error('Failed to fetch sensor details', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchSensor();
  }, [params.id, router]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!sensor) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Sensor not found</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 flex justify-center items-start pt-20">
      <div className="w-full max-w-5xl space-y-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <button onClick={() => router.back()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors mt-1">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{sensor.sensorType} Sensor</h1>
                <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded text-xs border border-green-400/20">
                  {sensor.status}
                </span>
              </div>
              <p className="text-slate-400">Asset: {sensor.asset.name} | Unit: {sensor.unit}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-1">Threshold</p>
            <p className="text-2xl font-bold text-white">{sensor.threshold} {sensor.unit}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-1">Current Reading</p>
            <p className="text-2xl font-bold text-blue-400">
              {readings.length > 0 ? readings[readings.length - 1].value.toFixed(2) : 'N/A'} {sensor.unit}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-1">Anomalies Detected</p>
            <p className="text-2xl font-bold text-red-500">{sensor.anomalies.length}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-96 flex flex-col">
          <h2 className="text-lg font-medium text-white mb-4">24-Hour Historical Readings</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickFormatter={(tick) => new Date(tick).getHours() + ':00'} 
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} 
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                />
                <ReferenceLine y={sensor.threshold} label="Threshold" stroke="#ef4444" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-medium text-white">Anomaly History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sensor.anomalies.map((anomaly: any) => (
                  <tr key={anomaly.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-white">{(anomaly.score * 100).toFixed(0)}%</td>
                    <td className="px-6 py-4">
                      <span className={
                        anomaly.severity === 'CRITICAL' ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs border border-red-400/20' : 
                        anomaly.severity === 'HIGH' ? 'text-orange-400 bg-orange-400/10 px-2 py-1 rounded text-xs border border-orange-400/20' :
                        'text-slate-400 bg-slate-800 px-2 py-1 rounded text-xs'
                      }>
                        {anomaly.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{anomaly.description}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(anomaly.detectedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {sensor.anomalies.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No anomalies detected for this sensor.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SensorDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <SensorDetailsContent />
    </Suspense>
  );
}
