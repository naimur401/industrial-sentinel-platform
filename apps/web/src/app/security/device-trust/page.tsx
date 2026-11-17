'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, Shield, ShieldCheck, ShieldX, ShieldAlert, Monitor, Clock, Laptop, Smartphone } from 'lucide-react';
import Link from 'next/link';

const trustStyles: any = {
  TRUSTED: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: ShieldCheck, label: 'Trusted' },
  UNKNOWN: { color: 'text-slate-400', bg: 'bg-slate-700/30', border: 'border-slate-600', icon: Shield, label: 'Unknown' },
  UNTRUSTED: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: ShieldAlert, label: 'Untrusted' },
  BLOCKED: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: ShieldX, label: 'Blocked' },
};

export default function DeviceTrustPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      const token = Cookies.get('token');
      const res = await axios.get('http://localhost:3000/zero-trust/devices', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setDevices(res.data);
    } catch (err) {
      console.error('Failed to fetch devices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }
    fetchDevices();
  }, [router]);

  const handleTrustChange = async (id: string, status: string) => {
    try {
      const token = Cookies.get('token');
      await axios.patch('http://localhost:3000/zero-trust/devices/' + id + '/trust',
        { trustStatus: status },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      await fetchDevices();
    } catch (err) {
      console.error('Failed to update trust', err);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6">
        <Link href="/security/zero-trust" className="text-slate-400 hover:text-white mr-4 transition-colors">
          ? Back
        </Link>
        <h1 className="text-xl font-semibold text-white">Device Trust Registry</h1>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => {
            const style = trustStyles[device.trustStatus] || trustStyles.UNKNOWN;
            const Icon = style.icon;
            const isMobile = device.name.toLowerCase().includes('iphone') || device.name.toLowerCase().includes('android') || device.name.toLowerCase().includes('samsung');
            const DeviceIcon = isMobile ? Smartphone : Laptop;
            return (
              <div key={device.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <DeviceIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className={'flex items-center px-2 py-1 rounded text-xs border ' + style.color + ' ' + style.bg + ' ' + style.border}>
                    <Icon className="w-3 h-3 mr-1" /> {style.label}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{device.name}</h3>
                <p className="text-xs text-slate-500 font-mono mb-4">{device.deviceFingerprint.substring(0, 20)}...</p>
                
                <div className="space-y-2 text-sm text-slate-400 mb-4">
                  <div className="flex items-center">
                    <Monitor className="w-4 h-4 mr-2 text-slate-500" />
                    <span>{device.os || 'Unknown OS'}</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-slate-500" />
                    <span>{device.browser || 'Unknown Browser'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-slate-500" />
                    <span>Last seen: {new Date(device.lastActivity).toLocaleDateString()}</span>
                  </div>
                </div>

                <select 
                  value={device.trustStatus} 
                  onChange={(e) => handleTrustChange(device.id, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white outline-none"
                >
                  <option value="TRUSTED">Mark as Trusted</option>
                  <option value="UNKNOWN">Mark as Unknown</option>
                  <option value="UNTRUSTED">Mark as Untrusted</option>
                  <option value="BLOCKED">Block Device</option>
                </select>
              </div>
            );
          })}
          {devices.length === 0 && (
            <div className="col-span-full text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
              <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No devices registered yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
