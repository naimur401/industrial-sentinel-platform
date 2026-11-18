'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Shield, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';

export default function MFAPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserId(parsed.id);
      } catch (e) {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/auth/verify-mfa', { userId, code });
      setSuccess(true);
      Cookies.remove('pending_mfa_user');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid MFA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <button onClick={() => router.push('/login')} className="flex items-center text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/20">
                <Shield className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Two-Factor Authentication</h1>
            <p className="text-sm text-slate-400 mt-2">Enter the 6-digit code from your authenticator app</p>
          </div>

          {success ? (
            <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-medium">MFA verified successfully!</p>
              <p className="text-sm text-slate-400 mt-1">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Verification Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="000000"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">Demo code: <span className="text-blue-400 font-mono">123456</span></p>
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
