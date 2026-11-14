'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, AlertTriangle, Clock, MessageSquare, Send, User, Activity } from 'lucide-react';

export default function IncidentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [incident, setIncident] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchIncident = async () => {
    try {
      const token = Cookies.get('token');
      const res = await axios.get('http://localhost:3000/incidents/' + params.id, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setIncident(res.data);
    } catch (err) {
      console.error('Failed to fetch incident', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }
    if (params.id) fetchIncident();
  }, [params.id, router]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const token = Cookies.get('token');
      const user = JSON.parse(Cookies.get('user') || '{}');
      await axios.post('http://localhost:3000/incidents/' + params.id + '/comments', 
        { comment, author: user.name || 'User' },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setComment('');
      await fetchIncident();
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const token = Cookies.get('token');
      await axios.patch('http://localhost:3000/incidents/' + params.id + '/status',
        { status: newStatus },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      await fetchIncident();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!incident) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Incident not found</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 flex justify-center items-start pt-10">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <button onClick={() => router.back()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors mt-1">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">{incident.title}</h1>
                  <span className={
                    incident.severity === 'CRITICAL' ? 'text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs border border-red-400/20' :
                    incident.severity === 'HIGH' ? 'text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded text-xs border border-orange-400/20' :
                    'text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded text-xs border border-yellow-400/20'
                  }>{incident.severity}</span>
                </div>
                <p className="text-slate-400">{incident.description || 'No description provided.'}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center"><Activity className="w-4 h-4 mr-1" /> {incident.category}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {new Date(incident.createdAt).toLocaleString()}</span>
                  <span className="flex items-center"><AlertTriangle className="w-4 h-4 mr-1" /> {incident.facility.name}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={incident.status} 
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white outline-none"
              >
                <option value="DETECTED">Detected</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" /> Timeline
          </h2>
          <div className="space-y-4">
            {incident.events?.map((event: any) => (
              <div key={event.id} className="flex items-start space-x-3">
                <div className={
                  event.eventType === 'CREATED' ? 'p-2 bg-blue-500/10 rounded-lg' :
                  event.eventType === 'STATUS_CHANGE' ? 'p-2 bg-yellow-500/10 rounded-lg' :
                  'p-2 bg-green-500/10 rounded-lg'
                }>
                  {event.eventType === 'CREATED' ? <AlertTriangle className="w-4 h-4 text-blue-400" /> :
                   event.eventType === 'STATUS_CHANGE' ? <Activity className="w-4 h-4 text-yellow-400" /> :
                   <MessageSquare className="w-4 h-4 text-green-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{event.description}</p>
                  <p className="text-xs text-slate-500">{new Date(event.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {(!incident.events || incident.events.length === 0) && (
              <p className="text-center text-slate-500 py-4">No timeline events yet.</p>
            )}
          </div>
        </div>

        {/* Add Comment */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" /> Add Investigation Note
          </h2>
          <form onSubmit={handleAddComment} className="flex space-x-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your investigation note..."
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" /> {submitting ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
