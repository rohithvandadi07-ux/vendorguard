import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Download, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScanHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/scans/history');
        setHistory(data);
      } catch (error) {
        if (error.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const handleDownloadJSON = (item) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `scan_${item.target}_${item.id}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Scan History</h1>
        <p className="text-gray-400 mt-1">Review previously assessed vendors and export reports.</p>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-cyber-400">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>No scans found. Go to Scan Vendor to assess a target.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cyber-900/80 border-b border-cyber-800 text-gray-400 text-sm">
                  <th className="p-4 font-medium">Target</th>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Score</th>
                  <th className="p-4 font-medium">Severity</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-cyber-800">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-cyber-800/30 transition-colors group">
                    <td className="p-4 text-white font-medium">{item.target}</td>
                    <td className="p-4 text-gray-300">{item.company_name || '-'}</td>
                    <td className="p-4 text-gray-400">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="p-4">
                      <span className="font-mono text-white">{item.overall_score}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md border text-xs font-semibold uppercase tracking-wider ${getSeverityBadge(item.severity_classification)}`}>
                        {item.severity_classification}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDownloadJSON(item)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-cyber-700 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Export JSON Report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanHistory;
