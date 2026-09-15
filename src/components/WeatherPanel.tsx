import { useApp } from '../context';

export default function WeatherPanel() {
  const { weather: weatherData, fires, selectFire, setViewMode } = useApp();

  const getFireRiskColor = (risk: string) => {
    switch (risk) {
      case 'extreme': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'very-high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'high': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'moderate': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  // Fires most affected by current weather
  const weatherAffectedFires = fires
    .filter(f => f.severity === 'critical' || f.severity === 'high')
    .slice(0, 2);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
        </svg>
        <span className="text-white font-medium text-sm">Weather & Risk</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold text-white">{weatherData.temperature}°C</div>
            <div className="text-gray-400 text-xs">{weatherData.condition}</div>
          </div>
          <div className="text-right">
            <div className={`text-xs px-2 py-1 rounded-full border font-medium ${getFireRiskColor(weatherData.fireRisk)}`}>
              🔥 RIESGO {weatherData.fireRisk.toUpperCase()}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <svg className="w-5 h-5 text-blue-300 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/>
            </svg>
            <div className="text-white font-bold text-sm">{weatherData.humidity}%</div>
            <div className="text-gray-400 text-xs">Humidity</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <svg className="w-5 h-5 text-cyan-300 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.5 17c0 1.65-1.35 3-3 3s-3-1.35-3-3h2c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1H2v-2h9.5c1.65 0 3 1.35 3 3zM19 6.5C19 4.57 17.43 3 15.5 3S12 4.57 12 6.5h2c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S16.33 8 15.5 8H2v2h13.5c1.93 0 3.5-1.57 3.5-3.5zm-.5 4.5H2v2h16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5v2c1.93 0 3.5-1.57 3.5-3.5S20.43 11 18.5 11z"/>
            </svg>
            <div className="text-white font-bold text-sm">{weatherData.windSpeed} km/h</div>
            <div className="text-gray-400 text-xs">Wind {weatherData.windDirection}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <svg className="w-5 h-5 text-orange-300 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"/>
            </svg>
            <div className="text-white font-bold text-sm">UV 9</div>
            <div className="text-gray-400 text-xs">Very High</div>
          </div>
        </div>

        {/* Weather impact on fires */}
        {weatherAffectedFires.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <p className="text-xs text-gray-400 mb-2">⚠ Weather Impact</p>
            <div className="space-y-1.5">
              {weatherAffectedFires.map((fire) => (
                <button
                  key={fire.id}
                  onClick={() => { selectFire(fire.id); setViewMode('dashboard'); }}
                  className="w-full flex items-center gap-2 text-left hover:bg-gray-700/30 rounded-md p-1.5 transition-colors"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    fire.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-xs text-gray-300 flex-1 truncate">{fire.name}</span>
                  <span className="text-xs text-red-400">Wind risk ↑</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
