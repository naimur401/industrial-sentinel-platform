'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { LayoutDashboard, Shield, AlertTriangle, Activity, Server, Bell, LogOut, User, Lock, Check, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [nameForm, setNameForm] = useState({ name: '', email: '' });
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) setUser(JSON.parse(userData));

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3000/auth/profile/me', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setProfile(res.data);
        setNameForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const token = Cookies.get('token');
      const res = await axios.patch('http://localhost:3000/auth/profile/me', nameForm, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setProfile({ ...profile, name: res.data.name, email: res.data.email });
      
      // Update cookie
      const updatedUser = { ...user, name: res.data.name, email: res.data.email };
      Cookies.set('user', JSON.stringify(updatedUser), { expires: 1 });
      setUser(updatedUser);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const token = Cookies.get('token');
      await axios.patch('http://localhost:3000/auth/password', 
        { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
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
            <Link href="/profile" className="flex items-center px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <UserCircle className="w-5 h-5 mr-3" /> My Profile
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
          <h1 className="text-xl font-semibold text-white">Profile Settings</h1>
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
          <div className="max-w-3xl mx-auto">
            {/* Profile Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-slate-400">{user.email}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-6">
              <button 
                onClick={() => setActiveTab('profile')}
                className={'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' + (activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800')}
              >
                <User className="w-4 h-4 inline mr-2" /> Profile Info
              </button>
              <button 
                onClick={() => setActiveTab('password')}
                className={'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' + (activeTab === 'password' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800')}
              >
                <Lock className="w-4 h-4 inline mr-2" /> Change Password
              </button>
            </div>

            {/* Message */}
            {message.text && (
              <div className={'p-3 mb-4 rounded-lg text-sm border ' + (message.type === 'success' ? 'text-green-400 bg-green-900/20 border-green-900/50' : 'text-red-400 bg-red-900/20 border-red-900/50')}>
                {message.text}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                    <input type="text" required value={nameForm.name} onChange={(e) => setNameForm({...nameForm, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Email</label>
                    <input type="email" required value={nameForm.email} onChange={(e) => setNameForm({...nameForm, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={submitting} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                      <Check className="w-4 h-4 mr-2" /> {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Current Password</label>
                    <input type="password" required value={pwForm.oldPassword} onChange={(e) => setPwForm({...pwForm, oldPassword: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">New Password</label>
                    <input type="password" required value={pwForm.newPassword} onChange={(e) => setPwForm({...pwForm, newPassword: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Confirm New Password</label>
                    <input type="password" required value={pwForm.confirmPassword} onChange={(e) => setPwForm({...pwForm, confirmPassword: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={submitting} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                      <Lock className="w-4 h-4 mr-2" /> {submitting ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
