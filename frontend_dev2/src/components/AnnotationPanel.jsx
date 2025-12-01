import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext.jsx';
import api from '../api.js';

export default function AnnotationPanel({ resultId }) {
  const socket = useSocket();
  const [annotations, setAnnotations] = useState([]);
  const [text, setText] = useState('');

  const addAnnotation = async () => {
    const { data } = await api.post(`/annotations/${resultId}`, { text });
    setAnnotations([...annotations, data]);
    socket.emit('new-annotation', data);
    setText('');
  };

  useEffect(() => {
    socket?.on('annotation-added', (data) => {
      if (data.resultId === resultId) setAnnotations(prev => [...prev, data]);
    });
  }, [socket]);

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="font-semibold mb-2">Annotations</h2>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {annotations.map(a => <p key={a._id}>{a.text}</p>)}
      </div>
      <div className="flex gap-2 mt-3">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 border p-1 rounded"
          placeholder="Add annotation..."
        />
        <button onClick={addAnnotation} className="bg-blue-500 text-white px-3 rounded">+</button>
      </div>
    </div>
  );
}
