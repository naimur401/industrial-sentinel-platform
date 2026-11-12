'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { LayoutDashboard, Shield, AlertTriangle, Activity, Server, Bell, LogOut, UserPlus, KeyRound, Building2, Wrench, Plus, X, CheckCircle, Clock, UserCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ assetId: '', title: '', description: '', priority: 'MEDIUM', dueDate: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token');
      const [ordersRes, assetsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:3000/maintenance', { headers: { Authorization: 'Bearer ' + token } }),
        axios.get('http://localhost:3000/assets', { headers: { Authorization: 'Bearer ' + token } }),
        axios.get('http://localhost:3000/maintenance/stats', { headers: { Authorization: 'Bearer ' + token } }),
      ]);
      setOrders(ordersRes.data);
      setAssets(assetsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    if (!token) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
    fetchData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = Cookies.get('token');
      await axios.post('http://localhost:3000/maintenance', formData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      await fetchData();
      setShowForm(false);
      setFormData({ assetId: '', title: '', description: '', priority: 'MEDIUM', dueDate: '' });
    } catch (err) {
      console.error('Failed to create order', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const token = Cookies.get('token');
      await axios.patch('http://localhost:3000/maintenance/' + id + '/status', { status }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
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
          <Link href="/maintenance" className="flex items-center px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <Wrench className="w-5 h-5 mr-3" /> Maintenance
          </Link>
          <Link href="/notifications" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5 mr-3" /> Notifications
          </Link>
          <Link href="/reports" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
            <FileText className="w-5 h-5 mr-3" /> Reports
          </Link>
          <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="px-4 text-xs text-slate-500 uppercase tracking-wider mb-2">Administration</p>
            <Link href="/admin/users" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
              <UserPlus className="w-5 h-5 mr-3" /> User Management
            </Link>
            <Link href="/admin/roles" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
              <KeyRound className="w-5 h-5 mr-3" /> Role Management
            </Link>
            <Link href="/admin/facilities" className="flex items-center px-4 py-2.5 hover:bg-slate-800 rounded-lg transition-colors">
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
          <h1 className="text-xl font-semibold text-white">Maintenance Management</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowForm(true)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
              <Plus className="w-4 h-4 mr-2" /> New Work Order
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Open</p>
              <p className="text-3xl font-bold text-red-500">{stats.open}</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.inProgress}</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Asset</th>
                    <th className="px-6 py-4 font-medium">Priority</th>
                    <th className="px-6 py-4 font-medium">Due Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{order.title}</td>
                      <td className="px-6 py-4 text-slate-400">{order.asset.name}</td>
                      <td className="px-6 py-4">
                        <span className={
                          order.priority === 'CRITICAL' ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs border border-red-400/20' :
                          order.priority === 'HIGH' ? 'text-orange-400 bg-orange-400/10 px-2 py-1 rounded text-xs border border-orange-400/20' :
                          order.priority === 'MEDIUM' ? 'text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded text-xs border border-yellow-400/20' :
                          'text-slate-400 bg-slate-800 px-2 py-1 rounded text-xs'
                        }>{order.priority}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={
                          order.status === 'COMPLETED' ? 'text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs border border-green-400/20' :
                          order.status === 'IN_PROGRESS' ? 'text-blue-400 bg-blue-400/10 px-2 py-1 rounded text-xs border border-blue-400/20' :
                          order.status === 'OVERDUE' ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs border border-red-400/20' :
                          'text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded text-xs border border-yellow-400/20'
                        }>{order.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none"
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="OVERDUE">Overdue</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">New Work Order</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Asset</label>
                <select required value={formData.assetId} onChange={(e) => setFormData({...formData, assetId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none">
                  <option value="">Select Asset</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" rows={3} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Priority</label>
                <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Due Date</label>
                <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
