import { useApp } from '../context';

export default function MapView() {
  const {
    fires, selectedFireId, selectFire,
    hoveredFireId, setHoveredFireId,
    selectedFire, filterSeverity, setFilterSeverity,
    setViewMode,
  } = useApp();

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

  const toSvgCoords = (lat: number, lng: number) => {
    const x = ((lng + 130) / 20) * 800;
    const y = ((50 - lat) / 15) * 500;
    return { x: Math.max(50, Math.min(750, x)), y: Math.max(30, Math.min(470, y)) };
  };

  const filteredFires = filterSeverity
    ? fires.filter(f => f.severity === filterSeverity)
    : fires;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="text-white font-medium text-sm">Operational Map</span>
          {filterSeverity && (
            <button
              onClick={() => setFilterSeverity(null)}
              className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full hover:bg-orange-500/30 transition-colors"
            >
              Filter: {filterSeverity} ✕
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {['critical', 'high', 'medium', 'low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(filterSeverity === sev ? null : sev)}
                className={`w-3 h-3 rounded-full border-2 transition-all ${
                  filterSeverity === sev ? 'scale-125' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: getSeverityColor(sev),
                  borderColor: filterSeverity === sev ? 'white' : 'transparent',
                }}
                title={sev}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">West Coast Region</span>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
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
            <filter id="glowSelected">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <rect width="800" height="500" fill="url(#mapBg)"/>

          {/* Grid */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="500" stroke="#1e3a4f" strokeWidth="0.5" opacity="0.3"/>
          ))}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#1e3a4f" strokeWidth="0.5" opacity="0.3"/>
          ))}

          {/* Coastline */}
          <path
            d="M 150 30 Q 180 60 170 100 Q 160 140 140 180 Q 130 220 150 260 Q 160 300 180 340 Q 200 380 220 420 Q 240 460 260 480"
            fill="none" stroke="#2d5a3d" strokeWidth="2" opacity="0.6"
          />
          <path
            d="M 150 30 Q 200 40 250 30 Q 300 50 350 40 Q 400 60 450 50 Q 500 70 550 60 Q 600 80 650 70 L 700 80 L 700 480 L 260 480 Q 240 460 220 420 Q 200 380 180 340 Q 160 300 150 260 Q 130 220 140 180 Q 160 140 170 100 Q 180 60 150 30 Z"
            fill="#1a3a2a" opacity="0.3"
          />

          {/* State boundaries */}
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

          {/* Connection lines between fires */}
          {filteredFires.map((fire, i) => {
            const coords = toSvgCoords(fire.lat, fire.lng);
            return filteredFires.slice(i + 1).map((otherFire) => {
              const otherCoords = toSvgCoords(otherFire.lat, otherFire.lng);
              const dist = Math.sqrt(
                Math.pow(coords.x - otherCoords.x, 2) + Math.pow(coords.y - otherCoords.y, 2)
              );
              if (dist > 300) return null;
              return (
                <line
                  key={`${fire.id}-${otherFire.id}`}
                  x1={coords.x} y1={coords.y}
                  x2={otherCoords.x} y2={otherCoords.y}
                  stroke="#374151"
                  strokeWidth="0.5"
                  strokeDasharray="3,3"
                  opacity="0.4"
                />
              );
            });
          })}

          {/* Fire incidents */}
          {filteredFires.map((fire) => {
            const coords = toSvgCoords(fire.lat, fire.lng);
            const color = getSeverityColor(fire.severity);
            const radius = Math.max(8, Math.min(30, fire.acres / 200));
            const isSelected = selectedFireId === fire.id;
            const isHovered = hoveredFireId === fire.id;
            const isDimmed = filterSeverity && fire.severity !== filterSeverity;

            return (
              <g
                key={fire.id}
                onClick={() => selectFire(isSelected ? null : fire.id)}
                onMouseEnter={() => setHoveredFireId(fire.id)}
                onMouseLeave={() => setHoveredFireId(null)}
                className="cursor-pointer"
                opacity={isDimmed ? 0.3 : 1}
              >
                {/* Fire glow */}
                <circle
                  cx={coords.x} cy={coords.y}
                  r={radius * (isSelected ? 3.5 : 2.5)}
                  fill={color}
                  opacity={isSelected ? 0.2 : 0.1}
                  className={getSeverityPulse(fire.severity)}
                />
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={coords.x} cy={coords.y}
                    r={radius * 2}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    opacity="0.8"
                    className="animate-spin-slow"
                  />
                )}
                {/* Fire ring */}
                <circle
                  cx={coords.x} cy={coords.y}
                  r={radius * 1.5}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity={0.4}
                  className={getSeverityPulse(fire.severity)}
                />
                {/* Fire center */}
                <circle
                  cx={coords.x} cy={coords.y}
                  r={isSelected || isHovered ? radius * 0.8 : radius * 0.6}
                  fill={color}
                  opacity={0.9}
                  filter={isSelected ? "url(#glowSelected)" : "url(#glow)"}
                />
                {/* Containment arc */}
                <circle
                  cx={coords.x} cy={coords.y}
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
                      x={coords.x - 60} y={coords.y - radius - 30}
                      width="120" height="24"
                      rx="4"
                      fill="#1f2937"
                      stroke={isSelected ? 'white' : color}
                      strokeWidth={isSelected ? 1.5 : 1}
                      opacity="0.95"
                    />
                    <text
                      x={coords.x} y={coords.y - radius - 14}
                      textAnchor="middle" fill="white"
                      fontSize="10" fontWeight="bold"
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
          <div className="absolute bottom-4 left-4 bg-gray-900/95 backdrop-blur-sm border border-orange-500/50 rounded-xl p-4 w-72 shadow-lg shadow-orange-500/10">
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
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => selectFire(null)}
                className="flex-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-1.5 rounded-md transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setViewMode('resources')}
                className="flex-1 text-xs bg-orange-600 hover:bg-orange-500 text-white py-1.5 rounded-md transition-colors"
              >
                View Resources
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
