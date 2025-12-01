import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext.jsx';

export default function CommentsSection({ threadId }) {
  const socket = useSocket();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  const sendComment = () => {
    if (!text.trim()) return;
    const comment = { text, threadId, id: Date.now() };
    setComments([...comments, comment]);
    socket.emit('new-comment', comment);
    setText('');
  };

  useEffect(() => {
    socket?.on('comment-added', (comment) => {
      if (comment.threadId === threadId) setComments(prev => [...prev, comment]);
    });
  }, [socket]);

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow">
      <h2 className="font-semibold mb-2">Team Comments</h2>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {comments.map(c => <p key={c.id}>{c.text}</p>)}
      </div>
      <div className="flex gap-2 mt-3">
        <input value={text} onChange={e => setText(e.target.value)}
               className="flex-1 border p-1 rounded"
               placeholder="Add comment..." />
        <button onClick={sendComment} className="bg-green-500 text-white px-3 rounded">Send</button>
      </div>
    </div>
  );
}
