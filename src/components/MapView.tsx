import { useState } from 'react';
import { fireIncidents, type FireIncident } from '../data';

export default function MapView() {
  const [selectedFire, setSelectedFire] = useState<FireIncident | null>(null);
  const [hoveredFire, setHoveredFire] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getSeverityPulse = (severity: string) => {
    switch (severity) {
      case 'critical': return 'animate-pulse-fast';
      case 'high': return 'animate-pulse';
      default: return '';
    }
  };

  // Convert lat/lng to SVG coordinates (simplified projection)
  const toSvgCoords = (lat: number, lng: number) => {
    const x = ((lng + 130) / 20) * 800;
    const y = ((50 - lat) / 15) * 500;
    return { x: Math.max(50, Math.min(750, x)), y: Math.max(30, Math.min(470, y)) };
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="text-white font-medium text-sm">Operational Map</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">West Coast Region</span>
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        {/* Map Background */}
        <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Background gradient */}
          <defs>
            <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a2332"/>
              <stop offset="100%" stopColor="#0f1923"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Map background */}
          <rect width="800" height="500" fill="url(#mapBg)"/>

          {/* Grid lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="500" stroke="#1e3a4f" strokeWidth="0.5" opacity="0.3"/>
          ))}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#1e3a4f" strokeWidth="0.5" opacity="0.3"/>
          ))}

          {/* Simplified West Coast outline */}
          <path
            d="M 150 30 Q 180 60 170 100 Q 160 140 140 180 Q 130 220 150 260 Q 160 300 180 340 Q 200 380 220 420 Q 240 460 260 480"
            fill="none"
            stroke="#2d5a3d"
            strokeWidth="2"
            opacity="0.6"
          />
          <path
            d="M 150 30 Q 200 40 250 30 Q 300 50 350 40 Q 400 60 450 50 Q 500 70 550 60 Q 600 80 650 70 L 700 80 L 700 480 L 260 480 Q 240 460 220 420 Q 200 380 180 340 Q 160 300 150 260 Q 130 220 140 180 Q 160 140 170 100 Q 180 60 150 30 Z"
            fill="#1a3a2a"
            opacity="0.3"
          />

          {/* State boundaries (simplified) */}
          <path d="M 150 180 L 700 180" stroke="#2d5a3d" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4"/>
          <path d="M 150 300 L 700 300" stroke="#2d5a3d" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4"/>
          <path d="M 350 30 L 350 480" stroke="#2d5a3d" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4"/>
          <path d="M 550 30 L 550 480" stroke="#2d5a3d" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4"/>

          {/* State labels */}
          <text x="240" y="110" fill="#4a7a5a" fontSize="12" fontWeight="bold" opacity="0.5">WA</text>
          <text x="240" y="240" fill="#4a7a5a" fontSize="12" fontWeight="bold" opacity="0.5">OR</text>
          <text x="200" y="380" fill="#4a7a5a" fontSize="12" fontWeight="bold" opacity="0.5">CA</text>
          <text x="450" y="240" fill="#4a7a5a" fontSize="12" fontWeight="bold" opacity="0.5">NV</text>
          <text x="600" y="380" fill="#4a7a5a" fontSize="12" fontWeight="bold" opacity="0.5">AZ</text>

          {/* Fire incidents */}
          {fireIncidents.map((fire) => {
            const coords = toSvgCoords(fire.lat, fire.lng);
            const color = getSeverityColor(fire.severity);
            const radius = Math.max(8, Math.min(30, fire.acres / 200));
            const isSelected = selectedFire?.id === fire.id;
            const isHovered = hoveredFire === fire.id;

            return (
              <g
                key={fire.id}
                onClick={() => setSelectedFire(fire)}
                onMouseEnter={() => setHoveredFire(fire.id)}
                onMouseLeave={() => setHoveredFire(null)}
                className="cursor-pointer"
              >
                {/* Fire glow */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={radius * 2.5}
                  fill={color}
                  opacity={0.1}
                  className={getSeverityPulse(fire.severity)}
                />
                {/* Fire ring */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={radius * 1.5}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity={0.4}
                  className={getSeverityPulse(fire.severity)}
                />
                {/* Fire center */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isSelected || isHovered ? radius * 0.8 : radius * 0.6}
                  fill={color}
                  opacity={0.9}
                  filter="url(#glow)"
                />
                {/* Containment arc */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray={`${(fire.containment / 100) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
                  opacity={0.7}
                  transform={`rotate(-90 ${coords.x} ${coords.y})`}
                />
                {/* Label */}
                {(isSelected || isHovered) && (
                  <g>
                    <rect
                      x={coords.x - 55}
                      y={coords.y - radius - 28}
                      width="110"
                      height="22"
                      rx="4"
                      fill="#1f2937"
                      stroke={color}
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x={coords.x}
                      y={coords.y - radius - 13}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {fire.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Legend */}
          <g transform="translate(600, 400)">
            <rect x="0" y="0" width="180" height="85" rx="6" fill="#111827" stroke="#374151" strokeWidth="1" opacity="0.9"/>
            <text x="10" y="18" fill="#9ca3af" fontSize="10" fontWeight="bold">SEVERITY</text>
            <circle cx="20" cy="35" r="5" fill="#ef4444"/>
            <text x="30" y="38" fill="#d1d5db" fontSize="9">Critical</text>
            <circle cx="90" cy="35" r="5" fill="#f97316"/>
            <text x="100" y="38" fill="#d1d5db" fontSize="9">High</text>
            <circle cx="20" cy="55" r="5" fill="#eab308"/>
            <text x="30" y="58" fill="#d1d5db" fontSize="9">Medium</text>
            <circle cx="90" cy="55" r="5" fill="#22c55e"/>
            <text x="100" y="58" fill="#d1d5db" fontSize="9">Low</text>
            <text x="10" y="75" fill="#6b7280" fontSize="8">Ring = Containment %</text>
          </g>
        </svg>

        {/* Selected fire info overlay */}
        {selectedFire && (
          <div className="absolute bottom-4 left-4 bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-xl p-4 w-72">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">{selectedFire.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                selectedFire.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                selectedFire.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                selectedFire.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {selectedFire.severity.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400">Location:</span>
                <p className="text-gray-200">{selectedFire.location}</p>
              </div>
              <div>
                <span className="text-gray-400">Acres:</span>
                <p className="text-gray-200">{selectedFire.acres.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-400">Containment:</span>
                <p className="text-gray-200">{selectedFire.containment}%</p>
              </div>
              <div>
                <span className="text-gray-400">Cause:</span>
                <p className="text-gray-200">{selectedFire.cause}</p>
              </div>
              <div>
                <span className="text-gray-400">Crews:</span>
                <p className="text-gray-200">{selectedFire.crews}</p>
              </div>
              <div>
                <span className="text-gray-400">Engines:</span>
                <p className="text-gray-200">{selectedFire.engines}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFire(null)}
              className="mt-3 text-xs text-gray-400 hover:text-white transition-colors"
            >
              ✕ Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
