import { useApp } from '../context';

export default function NotificationToast() {
  const { notifications, dismissNotification } = useApp();

  if (notifications.length === 0) return null;

  const getNotifColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500 bg-green-500/10';
      case 'error': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '•';
    }
  };

  return (
    <div className="fixed bottom-16 right-4 z-50 space-y-2 max-w-sm">
      {notifications.slice(0, 3).map((notif) => (
        <div
          key={notif.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg animate-slide-in ${getNotifColor(notif.type)}`}
        >
          <span className="text-lg">{getNotifIcon(notif.type)}</span>
          <p className="text-white text-sm flex-1">{notif.message}</p>
          <button
            onClick={() => dismissNotification(notif.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
