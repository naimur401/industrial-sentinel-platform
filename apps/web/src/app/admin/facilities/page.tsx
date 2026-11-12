'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { LayoutDashboard, Shield, AlertTriangle, Activity, Server, Bell, LogOut, Plus, X, UserPlus, KeyRound, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function FacilityManagementPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) setUser(JSON.parse(userData));

    const fetchFacilities = async () => {
      try {
        const res = await axios.get('http://localhost:3000/facilities', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setFacilities(res.data);
      } catch (err) {
        console.error('Failed to fetch facilities', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = Cookies.get('token');
      await axios.post('http://localhost:3000/facilities', formData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      
      const res = await axios.get('http://localhost:3000/facilities', { 
        headers: { Authorization: 'Bearer ' + token } 
      });
      setFacilities(res.data);
      
      setShowForm(false);
      setFormData({ name: '', location: '' });
    } catch (err) {
      console.error('Failed to create facility', err);
    } finally {
      setSubmitting(false);
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
          <Link href="/ai" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Activity className="w-5 h-5 mr-3" /> AI Intelligence
          </Link>
          <Link href="/security" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Shield className="w-5 h-5 mr-3" /> Security
          </Link>
          <Link href="/incidents" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <AlertTriangle className="w-5 h-5 mr-3" /> Incidents
          </Link>
          <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="px-4 text-xs text-slate-500 uppercase tracking-wider mb-2">Administration</p>
            <Link href="/admin/users" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
              <UserPlus className="w-5 h-5 mr-3" /> User Management
            </Link>
            <Link href="/admin/roles" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
              <KeyRound className="w-5 h-5 mr-3" /> Role Management
            </Link>
            <Link href="/admin/facilities" className="flex items-center px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Building2 className="w-5 h-5 mr-3" /> Facility Management
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-white">Facility Management</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {facilities.map((facility) => (
              <div key={facility.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs border border-green-400/20">
                    {facility.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{facility.name}</h3>
                <p className="text-sm text-slate-400 flex items-center mb-4">
                  <MapPin className="w-4 h-4 mr-1" /> {facility.location}
                </p>
                <div className="flex space-x-4 text-sm">
                  <div>
                    <p className="text-slate-500">Assets</p>
                    <p className="text-white font-bold">{facility._count.assets}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Incidents</p>
                    <p className="text-white font-bold">{facility._count.incidents}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <button 
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New Facility
            </button>
          </div>
        </main>
      </div>

      {/* Add Facility Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Add New Facility</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Facility Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Main Refinery" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Location</label>
                <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Dhaka" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
