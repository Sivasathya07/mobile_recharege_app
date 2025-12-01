import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AnnotationPanel from '../components/AnnotationPanel.jsx';
import CommentsSection from '../components/CommentsSection.jsx';
import NotificationBell from '../components/NotificationBell.jsx';
import FavoritesList from '../components/FavoritesList.jsx';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p className="p-6 text-center text-gray-500">Please login to access dashboard</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Collaboration Dashboard</h1>
        <NotificationBell />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <AnnotationPanel resultId="123" />
        <CommentsSection threadId="abc" />
      </div>
      <FavoritesList />
    </div>
  );
}
