'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { LayoutDashboard, Shield, AlertTriangle, Activity, Server, Bell, LogOut, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AnomalyDetectionPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sensors, setSensors] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) setUser(JSON.parse(userData));

    const fetchData = async () => {
      try {
        const [sensorsRes, anomaliesRes] = await Promise.all([
          axios.get('http://localhost:3000/sensors', { headers: { Authorization: 'Bearer ' + token } }),
          axios.get('http://localhost:3000/sensors/anomalies', { headers: { Authorization: 'Bearer ' + token } })
        ]);
        setSensors(sensorsRes.data);
        setAnomalies(anomaliesRes.data);
      } catch (err) {
        console.error('Failed to fetch sensor data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDetect = async (sensorId: string, currentValue: number, threshold: number) => {
    setDetecting(sensorId);
    try {
      const token = Cookies.get('token');
      // Simulate a sensor reading with currentValue + random variation
      const simulatedValue = currentValue + (Math.random() * 20 - 10); 
      
      await axios.post('http://localhost:3000/sensors/detect', {
        sensorId: sensorId,
        value: simulatedValue,
      }, {
        headers: { Authorization: 'Bearer ' + token }
      });

      // Refresh anomalies
      const anomaliesRes = await axios.get('http://localhost:3000/sensors/anomalies', { 
        headers: { Authorization: 'Bearer ' + token } 
      });
      setAnomalies(anomaliesRes.data);
      
    } catch (err) {
      console.error('Detection failed', err);
      alert('Failed to run anomaly detection. Make sure AI service is running on port 8000.');
    } finally {
      setDetecting(null);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  if (!user || loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

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
          <Link href="/security" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Shield className="w-5 h-5 mr-3" /> Security
          </Link>
          <Link href="/incidents" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <AlertTriangle className="w-5 h-5 mr-3" /> Incidents
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center">
            <Link href="/ai" className="text-slate-400 hover:text-white mr-4 transition-colors">
              &larr; Back
            </Link>
            <h1 className="text-xl font-semibold text-white">Anomaly Detection</h1>
          </div>
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
          <div className="mb-6">
            <p className="text-slate-400">Monitor sensor readings and detect abnormal behavior using Isolation Forest AI models.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Total Sensors</p>
              <p className="text-3xl font-bold text-white">{sensors.length}</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Total Anomalies</p>
              <p className="text-3xl font-bold text-red-500">{anomalies.length}</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Active Detectors</p>
              <p className="text-3xl font-bold text-blue-500">1</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sensors List */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h2 className="text-lg font-medium text-white">Monitored Sensors</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3 font-medium">Sensor</th>
                      <th className="px-4 py-3 font-medium">Asset</th>
                      <th className="px-4 py-3 font-medium">Threshold</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {sensors.map((sensor) => (
                      <tr key={sensor.id} onClick={() => router.push('/sensors/' + sensor.id)} className="hover:bg-slate-800/30 transition-colors cursor-pointer">
                        <td className="px-4 py-3 text-white font-medium">
                          {sensor.sensorType} <span className="text-slate-500 text-xs">({sensor.unit})</span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{sensor.asset.name}</td>
                        <td className="px-4 py-3 text-slate-400">{sensor.threshold}</td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleDetect(sensor.id, sensor.threshold, sensor.threshold)}
                            disabled={detecting === sensor.id}
                            className="inline-flex items-center px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded transition-colors disabled:opacity-50"
                          >
                            <RefreshCw className={'w-3 h-3 mr-1 ' + (detecting === sensor.id ? 'animate-spin' : '')} />
                            Run AI
                          </button>
                        </td>
                      </tr>
                    ))}
                    {sensors.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No sensors found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Anomalies */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h2 className="text-lg font-medium text-white">Detected Anomalies</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3 font-medium">Sensor</th>
                      <th className="px-4 py-3 font-medium">Score</th>
                      <th className="px-4 py-3 font-medium">Severity</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {anomalies.map((anomaly) => (
                      <tr key={anomaly.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-white">{anomaly.sensor.sensorType}</td>
                        <td className="px-4 py-3 text-slate-400">{(anomaly.score * 100).toFixed(0)}%</td>
                        <td className="px-4 py-3">
                          <span className={
                            anomaly.severity === 'CRITICAL' ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs border border-red-400/20' : 
                            anomaly.severity === 'HIGH' ? 'text-orange-400 bg-orange-400/10 px-2 py-1 rounded text-xs border border-orange-400/20' :
                            'text-slate-400 bg-slate-800 px-2 py-1 rounded text-xs'
                          }>
                            {anomaly.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{new Date(anomaly.detectedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {anomalies.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No anomalies detected yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


