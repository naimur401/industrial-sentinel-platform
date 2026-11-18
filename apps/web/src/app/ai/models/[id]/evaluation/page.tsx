'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ArrowLeft, BarChart3, Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function ModelEvaluationPage() {
  const router = useRouter();
  const params = useParams();
  const [model, setModel] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) { router.push('/login'); return; }

    const fetchData = async () => {
      try {
        const headers = { Authorization: 'Bearer ' + token };
        const [modelRes, evalRes] = await Promise.all([
          axios.get('http://localhost:3000/models/' + params.id, { headers }),
          axios.get('http://localhost:3000/models/' + params.id + '/evaluations', { headers }),
        ]);
        setModel(modelRes.data);
        setEvaluations(evalRes.data);
      } catch (err) {
        console.error('Failed to fetch evaluation data', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchData();
  }, [params.id, router]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!model) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Model not found</div>;

  const latestEval = evaluations[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 flex justify-center items-start pt-10">
      <div className="w-full max-w-5xl space-y-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <button onClick={() => router.back()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors mt-1">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{model.name} - Evaluation</h1>
              <p className="text-slate-400">{model.algorithm} • {model.version}</p>
            </div>
          </div>
        </div>

        {latestEval ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-green-400">{(latestEval.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Precision</p>
                <p className="text-2xl font-bold text-blue-400">{(latestEval.precision * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Recall</p>
                <p className="text-2xl font-bold text-purple-400">{(latestEval.recall * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">F1 Score</p>
                <p className="text-2xl font-bold text-yellow-400">{(latestEval.f1Score * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">ROC-AUC</p>
                <p className="text-2xl font-bold text-orange-400">{latestEval.rocAuc.toFixed(3)}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">PR-AUC</p>
                <p className="text-2xl font-bold text-red-400">{latestEval.prAuc.toFixed(3)}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" /> Evaluation History
              </h2>
              <div className="space-y-2">
                {evaluations.map((ev) => (
                  <div key={ev.id} className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-sm text-slate-400">{new Date(ev.evaluatedAt).toLocaleString()}</span>
                    <div className="flex space-x-4 text-xs">
                      <span className="text-green-400">Acc: {(ev.accuracy * 100).toFixed(1)}%</span>
                      <span className="text-blue-400">F1: {(ev.f1Score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
            <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">No evaluations available for this model.</p>
          </div>
        )}

      </div>
    </div>
  );
}