import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, Activity, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/scans/history?limit=10');
        setHistory(data.reverse()); // oldest to newest for chart
      } catch (error) {
        if (error.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  const stats = [
    { name: 'Total Scans', value: history.length, icon: Activity, color: 'text-blue-400' },
    { name: 'Critical Risks', value: history.filter(h => h.severity_classification === 'Critical').length, icon: ShieldAlert, color: 'text-red-400' },
    { name: 'Secure Vendors', value: history.filter(h => h.severity_classification === 'Low').length, icon: ShieldCheck, color: 'text-green-400' },
    { name: 'Avg Score', value: history.length ? Math.round(history.reduce((a, b) => a + b.overall_score, 0) / history.length) : 0, icon: Users, color: 'text-purple-400' },
  ];

  const chartData = history.map((h, i) => ({
    name: `Scan ${i + 1}`,
    score: h.overall_score,
    target: h.target
  }));

  if (loading) return <div className="text-center py-20 text-cyber-400">Loading metrics...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Real-time vendor security posture metrics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="glass-panel p-6 flex items-center">
              <div className={`p-3 rounded-xl bg-cyber-800/50 ${stat.color} mr-4 border border-cyber-700/50`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-medium text-white mb-6">Recent Scan Score Trend</h3>
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No scan data available. Run a scan to see trends.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
