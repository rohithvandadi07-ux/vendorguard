import React, { useState } from 'react';
import { Search, Loader2, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import api from '../utils/api';

const ScanVendor = () => {
  const [target, setTarget] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!target) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const { data } = await api.post('/scans/run', { target, company_name: companyName });
      setResult(data);
    } catch (err) {
      setError('Failed to run scan. Ensure backend is reachable.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/50';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/50';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/50';
      case 'Low': return 'text-green-500 bg-green-500/10 border-green-500/50';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Scan Vendor</h1>
        <p className="text-gray-400 mt-1">Initiate a comprehensive security check on a vendor's infrastructure.</p>
      </div>

      <div className="glass-panel p-6">
        <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Vendor Domain or IP (e.g. example.com)"
              className="input-field"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Company Name (Optional)"
              className="input-field"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center md:w-32">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Search className="w-5 h-5 mr-2" /> Scan</>}
          </button>
        </form>
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
      </div>

      {loading && (
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-cyber-400">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyber-800 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-cyber-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 font-mono animate-pulse">Running security modules...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Score Card */}
          <div className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{result.company_name || result.target}</h2>
              <p className="text-gray-400">{result.target}</p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Risk Score</p>
                <div className="text-4xl font-extrabold text-white">{result.overall_score}<span className="text-lg text-gray-500">/100</span></div>
              </div>
              <div className={`px-4 py-2 rounded-xl border ${getSeverityColor(result.severity_classification)}`}>
                <span className="font-bold tracking-wide uppercase">{result.severity_classification} RISK</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SSL Info */}
            <div className="glass-panel p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 text-cyber-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">SSL/TLS Configuration</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-cyber-800 pb-2">
                  <span className="text-gray-400">Valid</span>
                  {result.ssl_analysis?.valid ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex justify-between border-b border-cyber-800 pb-2">
                  <span className="text-gray-400">Issuer</span>
                  <span className="text-white">{result.ssl_analysis?.issuer || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-cyber-800 pb-2">
                  <span className="text-gray-400">Expires</span>
                  <span className="text-white">{result.ssl_analysis?.expires_on ? new Date(result.ssl_analysis.expires_on).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Ports Info */}
            <div className="glass-panel p-6">
              <div className="flex items-center mb-4">
                <Info className="w-5 h-5 text-cyber-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Exposed Ports</h3>
              </div>
              <div className="space-y-3 text-sm">
                {result.port_scan?.open_ports?.length > 0 ? (
                  result.port_scan.open_ports.map(p => (
                    <div key={p.port} className="flex justify-between border-b border-cyber-800 pb-2">
                      <span className="text-gray-400">{p.service}</span>
                      <span className={`font-mono ${[80, 443].includes(p.port) ? 'text-green-400' : 'text-orange-400'}`}>{p.port}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No common ports exposed or host unreachable.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ScanVendor;
