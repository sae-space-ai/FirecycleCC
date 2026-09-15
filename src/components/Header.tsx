import { useState, useEffect } from 'react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.5 7 4 10 4 14.5C4 18.64 7.58 22 12 22C16.42 22 20 18.64 20 14.5C20 10 15.5 7 12 2ZM12 20C8.69 20 6 17.54 6 14.5C6 11.5 9 8.5 12 4.5C15 8.5 18 11.5 18 14.5C18 17.54 15.31 20 12 20Z"/>
                <path d="M12 18C10.34 18 9 16.66 9 15C9 13 12 10 12 10C12 10 15 13 15 15C15 16.66 13.66 18 12 18Z" opacity="0.6"/>
              </svg>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">FIRECYCLE</h1>
            <p className="text-gray-400 text-xs leading-tight">Command Center</p>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-700 mx-2"></div>
        <nav className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-sm font-medium text-white bg-gray-800 rounded-md border border-gray-600">
            Dashboard
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
            Map View
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
            Resources
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
            Analytics
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-red-400 animate-pulse">●</span>
          <span className="text-red-400 font-medium">LIVE</span>
        </div>
        <div className="text-gray-300 text-sm font-mono">
          {currentTime.toLocaleTimeString('en-US', { hour12: false })} UTC
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <span className="text-gray-300 text-sm">Admin</span>
        </div>
      </div>
    </header>
  );
}
