'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { LayoutDashboard, Shield, AlertTriangle, Activity, Server, Bell, LogOut, Check, CheckCheck, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = Cookies.get('token');
      const res = await axios.get('http://localhost:3000/notifications', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) setUser(JSON.parse(userData));
    fetchNotifications();
  }, [router]);

  const handleMarkRead = async (id: string) => {
    try {
      const token = Cookies.get('token');
      await axios.patch('http://localhost:3000/notifications/' + id + '/read', {}, {
        headers: { Authorization: 'Bearer ' + token }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = Cookies.get('token');
      await axios.patch('http://localhost:3000/notifications/mark-all-read', {}, {
        headers: { Authorization: 'Bearer ' + token }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  if (!user || loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Shield className="w-8 h-8 text-blue-500 mr-3" />
          <span className="text-white font-bold text-lg tracking-tight">Sentinel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
          <Link href="/notifications" className="flex items-center px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <Bell className="w-5 h-5 mr-3" /> Notifications
            {unreadCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
          </Link>
          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link href="/profile" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
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
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-white">Notifications</h1>
            {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount} new</span>}
          </div>
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
                <CheckCheck className="w-4 h-4 mr-2" /> Mark All Read
              </button>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-white">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-3">
            {notifications.length === 0 && (
              <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">No notifications yet.</p>
              </div>
            )}

            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={'p-4 rounded-xl border transition-colors ' + (notif.read ? 'bg-slate-900 border-slate-800' : 'bg-slate-900/80 border-blue-500/30 shadow-lg shadow-blue-500/5')}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={'p-2 rounded-lg mt-1 ' + (
                      notif.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400' :
                      notif.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400' :
                      notif.severity === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-blue-500/10 text-blue-400'
                    )}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={'font-medium ' + (notif.read ? 'text-slate-400' : 'text-white')}>{notif.title}</h3>
                        <span className={
                          notif.severity === 'CRITICAL' ? 'text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs border border-red-400/20' :
                          notif.severity === 'HIGH' ? 'text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded text-xs border border-orange-400/20' :
                          notif.severity === 'MEDIUM' ? 'text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded text-xs border border-yellow-400/20' :
                          'text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded text-xs border border-blue-400/20'
                        }>
                          {notif.severity}
                        </span>
                        {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                      </div>
                      <p className="text-sm text-slate-400">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {!notif.read && (
                    <button 
                      onClick={() => handleMarkRead(notif.id)}
                      className="flex items-center px-2 py-1 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                    >
                      <Check className="w-3 h-3 mr-1" /> Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
