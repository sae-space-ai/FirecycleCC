import { useState } from 'react';
import { useApp } from '../context';

export default function AnalyticsView() {
  const { fires, allResources, globalStats, selectFire, setViewMode, setFilterSeverity, setFilterResourceStatus } = useApp();
  const [selectedMetric, setSelectedMetric] = useState<'acres' | 'containment' | 'personnel'>('acres');

  const causeData = fires.reduce((acc, fire) => {
    acc[fire.cause] = (acc[fire.cause] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityData = fires.reduce((acc, fire) => {
    acc[fire.severity] = (acc[fire.severity] || 0) + fire.acres;
    return acc;
  }, {} as Record<string, number>);

  const maxAcres = Math.max(...fires.map(f => f.acres));

  const resourceTypeCount = allResources.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const totalPersonnel = allResources.reduce((sum, r) => sum + r.personnel, 0);
  const standbyPersonnel = allResources
    .filter(r => r.status === 'standby')
    .reduce((sum, r) => sum + r.personnel, 0);
  const utilizationRate = Math.round(
    (globalStats.personnelDeployed / (globalStats.personnelDeployed + standbyPersonnel || 1)) * 100
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
      {/* Left Column - Fire Analysis */}
      <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
        {/* Fire Size Comparison */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.5 7 4 10 4 14.5C4 18.64 7.58 22 12 22C16.42 22 20 18.64 20 14.5C20 10 15.5 7 12 2Z"/>
              </svg>
              Fire Size Comparison
            </h3>
            <div className="flex gap-1">
              {(['acres', 'containment', 'personnel'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                    selectedMetric === metric
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {[...fires]
              .sort((a, b) => {
                if (selectedMetric === 'acres') return b.acres - a.acres;
                if (selectedMetric === 'containment') return b.containment - a.containment;
                return b.crews - a.crews;
              })
              .map((fire) => {
                const value = selectedMetric === 'acres' ? fire.acres :
                             selectedMetric === 'containment' ? fire.containment :
                             fire.crews + fire.engines + fire.aircraft;
                const maxValue = selectedMetric === 'acres' ? maxAcres :
                                selectedMetric === 'containment' ? 100 :
                                Math.max(...fires.map(f => f.crews + f.engines + f.aircraft));
                const label = selectedMetric === 'acres' ? `${value.toLocaleString()} ac` :
                             selectedMetric === 'containment' ? `${value}%` :
                             `${value} units`;

                return (
                  <div
                    key={fire.id}
                    onClick={() => { selectFire(fire.id); setViewMode('dashboard'); }}
                    className="cursor-pointer group hover:bg-gray-700/30 rounded-lg p-2 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-300 group-hover:text-white transition-colors truncate">
                        {fire.name}
                      </span>
                      <span className="text-gray-400 ml-2 whitespace-nowrap">{label}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(value / maxValue) * 100}%`,
                          backgroundColor: getSeverityColor(fire.severity),
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Cause Analysis */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
          <h3 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            Cause Analysis
          </h3>
          <div className="space-y-2">
            {Object.entries(causeData).map(([cause, count]) => (
              <div key={cause} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{cause}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-700 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-yellow-500"
                      style={{ width: `${(count / fires.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-xs w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-700/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Human-caused</span>
              <span className="text-orange-400 font-medium">
                {Math.round((fires.filter(f => f.cause !== 'Lightning').length / fires.length) * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-gray-400">Natural causes</span>
              <span className="text-green-400 font-medium">
                {Math.round((fires.filter(f => f.cause === 'Lightning').length / fires.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Column - Containment & Severity */}
      <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
        {/* Containment Overview */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
          <h3 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Containment Overview
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => { setViewMode('map'); setFilterSeverity(null); }}
              className="bg-gray-900/50 rounded-lg p-3 text-center hover:bg-gray-700/50 transition-colors"
            >
              <div className="text-2xl font-bold text-green-400">{globalStats.avgContainment}%</div>
              <div className="text-gray-400 text-xs">Average</div>
            </button>
            <button
              onClick={() => { setViewMode('map'); setFilterSeverity(null); }}
              className="bg-gray-900/50 rounded-lg p-3 text-center hover:bg-gray-700/50 transition-colors"
            >
              <div className="text-2xl font-bold text-white">
                {fires.filter(f => f.containment >= 75).length}
              </div>
              <div className="text-gray-400 text-xs">&gt;75%</div>
            </button>
            <button
              onClick={() => { setViewMode('map'); setFilterSeverity('critical'); }}
              className="bg-gray-900/50 rounded-lg p-3 text-center hover:bg-gray-700/50 transition-colors"
            >
              <div className="text-2xl font-bold text-red-400">
                {fires.filter(f => f.containment < 30).length}
              </div>
              <div className="text-gray-400 text-xs">&lt;30%</div>
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {fires.map((fire) => (
              <button
                key={fire.id}
                onClick={() => { selectFire(fire.id); setViewMode('dashboard'); }}
                className="w-full flex items-center gap-2 hover:bg-gray-700/30 rounded-lg p-1 transition-colors text-left"
              >
                <span className="text-xs text-gray-400 w-24 truncate">{fire.name}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${fire.containment}%`,
                      backgroundColor: fire.containment >= 75 ? '#22c55e' :
                                       fire.containment >= 50 ? '#eab308' :
                                       fire.containment >= 25 ? '#f97316' : '#ef4444',
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-300 w-8 text-right">{fire.containment}%</span>
              </button>
            ))}
          </div>
        </div>

        {/* Acres by Severity */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
          <h3 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z"/>
            </svg>
            Acres by Severity
          </h3>
          <div className="space-y-3">
            {Object.entries(severityData).map(([severity, acres]) => (
              <button
                key={severity}
                onClick={() => { setFilterSeverity(severity); setViewMode('map'); }}
                className="w-full text-left hover:bg-gray-700/30 rounded-lg p-1 -m-1 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-300 capitalize flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getSeverityColor(severity) }}></span>
                    {severity}
                  </span>
                  <span className="text-gray-400">{acres.toLocaleString()} acres</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${(acres / globalStats.totalAcres) * 100}%`,
                      backgroundColor: getSeverityColor(severity),
                    }}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-0.5">
                  {Math.round((acres / globalStats.totalAcres) * 100)}% of total
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Resources & Personnel */}
      <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
        {/* Resource Distribution */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
          <h3 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
            Resource Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(resourceTypeCount).map(([type, count]) => (
              <button
                key={type}
                onClick={() => { setViewMode('resources'); setFilterResourceStatus(null); }}
                className="w-full flex items-center gap-3 hover:bg-gray-700/30 rounded-lg p-2 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 text-sm font-bold">{count}</span>
                </div>
                <div className="flex-1">
                  <div className="text-gray-300 text-sm capitalize">{type}s</div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                    <div
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{ width: `${(count / allResources.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-gray-500 text-xs">
                  {Math.round((count / allResources.length) * 100)}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Personnel Summary */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
          <h3 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/>
            </svg>
            Personnel Summary
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => { setViewMode('resources'); setFilterResourceStatus('deployed'); }}
              className="bg-gray-900/50 rounded-lg p-3 text-center hover:bg-gray-700/50 transition-colors"
            >
              <div className="text-xl font-bold text-yellow-400">{globalStats.personnelDeployed}</div>
              <div className="text-gray-400 text-xs">Deployed</div>
            </button>
            <button
              onClick={() => { setViewMode('resources'); setFilterResourceStatus('standby'); }}
              className="bg-gray-900/50 rounded-lg p-3 text-center hover:bg-gray-700/50 transition-colors"
            >
              <div className="text-xl font-bold text-white">{standbyPersonnel}</div>
              <div className="text-gray-400 text-xs">Standby</div>
            </button>
            <button
              onClick={() => { setViewMode('resources'); setFilterResourceStatus(null); }}
              className="bg-gray-900/50 rounded-lg p-3 text-center hover:bg-gray-700/50 transition-colors"
            >
              <div className="text-xl font-bold text-blue-400">{totalPersonnel}</div>
              <div className="text-gray-400 text-xs">Total</div>
            </button>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-400">Utilization Rate</span>
              <span className="text-green-400 font-medium">{utilizationRate}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                style={{ width: `${utilizationRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
          <h3 className="text-white font-medium text-sm mb-3">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Fires</span>
              <span className="text-white font-medium">{fires.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Resources</span>
              <span className="text-white font-medium">{allResources.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Critical Fires</span>
              <button
                onClick={() => { setFilterSeverity('critical'); setViewMode('map'); }}
                className="text-red-400 font-medium hover:text-red-300 transition-colors"
              >
                {fires.filter(f => f.severity === 'critical').length}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Lightning Causes</span>
              <span className="text-white font-medium">{fires.filter(f => f.cause === 'Lightning').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Human Causes</span>
              <span className="text-white font-medium">{fires.filter(f => f.cause !== 'Lightning').length}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
              <span className="text-gray-400">Total Acres Burning</span>
              <span className="text-orange-400 font-bold">{globalStats.totalAcres.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
