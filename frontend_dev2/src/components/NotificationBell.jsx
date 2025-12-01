import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext.jsx';

export default function NotificationBell() {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    socket?.on('notification', (data) => {
      setNotifications(prev => [data, ...prev]);
    });
  }, [socket]);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative text-xl">🔔
        {notifications.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white px-1 rounded-full">{notifications.length}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50">
          {notifications.length === 0 ? <p className="p-3 text-gray-400">No notifications</p> :
            notifications.map((n,i) => <div key={i} className="p-2 border-b">{n.message}</div>)
          }
        </div>
      )}
    </div>
  );
}
