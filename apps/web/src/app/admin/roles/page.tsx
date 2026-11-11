'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { LayoutDashboard, Shield, AlertTriangle, Activity, Server, Bell, LogOut, Plus, X, UserPlus, KeyRound, Check } from 'lucide-react';
import Link from 'next/link';

export default function RoleManagementPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPermModal, setShowPermModal] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

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
        const [rolesRes, permsRes] = await Promise.all([
          axios.get('http://localhost:3000/users/roles', { headers: { Authorization: 'Bearer ' + token } }),
          axios.get('http://localhost:3000/users/permissions', { headers: { Authorization: 'Bearer ' + token } })
        ]);
        setRoles(rolesRes.data);
        setPermissions(permsRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = Cookies.get('token');
      await axios.post('http://localhost:3000/users/roles', formData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      
      const rolesRes = await axios.get('http://localhost:3000/users/roles', { 
        headers: { Authorization: 'Bearer ' + token } 
      });
      setRoles(rolesRes.data);
      
      setShowForm(false);
      setFormData({ name: '' });
    } catch (err) {
      console.error('Failed to create role', err);
    } finally {
      setSubmitting(false);
    }
  };

  const openPermModal = (role: any) => {
    setShowPermModal(role);
    setSelectedPerms(role.rolePermissions.map((rp: any) => rp.permission.id));
  };

  const togglePermission = (permId: string) => {
    if (selectedPerms.includes(permId)) {
      setSelectedPerms(selectedPerms.filter(id => id !== permId));
    } else {
      setSelectedPerms([...selectedPerms, permId]);
    }
  };

  const savePermissions = async () => {
    if (!showPermModal) return;
    setSubmitting(true);
    try {
      const token = Cookies.get('token');
      await axios.put('http://localhost:3000/users/roles/' + showPermModal.id + '/permissions', 
        { permissionIds: selectedPerms },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      
      const rolesRes = await axios.get('http://localhost:3000/users/roles', { 
        headers: { Authorization: 'Bearer ' + token } 
      });
      setRoles(rolesRes.data);
      
      setShowPermModal(null);
    } catch (err) {
      console.error('Failed to update permissions', err);
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

  const groupedPerms = permissions.reduce((acc: any, perm: any) => {
    if (!acc[perm.resource]) acc[perm.resource] = [];
    acc[perm.resource].push(perm);
    return acc;
  }, {});

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
            <Link href="/admin/roles" className="flex items-center px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <KeyRound className="w-5 h-5 mr-3" /> Role Management
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
          <h1 className="text-xl font-semibold text-white">Role & Permission Management</h1>
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
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">All Roles ({roles.length})</h2>
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Role
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Role Name</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Permissions</th>
                    <th className="px-6 py-4 font-medium">Users</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{role.name}</td>
                      <td className="px-6 py-4">
                        <span className={role.isSystem ? 'text-purple-400 bg-purple-400/10 px-2 py-1 rounded text-xs border border-purple-400/20' : 'text-slate-400 bg-slate-800 px-2 py-1 rounded text-xs'}>
                          {role.isSystem ? 'System' : 'Custom'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{role.rolePermissions.length}</td>
                      <td className="px-6 py-4 text-slate-400">{role._count.userRoles}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openPermModal(role)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded transition-colors"
                        >
                          Edit Permissions
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Role Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Add New Role</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateRole} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Role Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. SOC Analyst" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {showPermModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Permissions for: {showPermModal.name}</h2>
              <button onClick={() => setShowPermModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {Object.entries(groupedPerms).map(([resource, perms]: [string, any]) => (
                <div key={resource} className="border border-slate-800 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3 capitalize">{resource}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {perms.map((perm: any) => (
                      <label key={perm.id} className="flex items-center space-x-2 cursor-pointer text-sm text-slate-300 hover:text-white">
                        <input 
                          type="checkbox" 
                          checked={selectedPerms.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600"
                        />
                        <span>{perm.action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-800 flex justify-end space-x-2">
              <button onClick={() => setShowPermModal(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
              <button onClick={savePermissions} disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
