import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('receive-message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    console.log("message", message);

    socket.emit('message', message); // Send message to server
    setMessage('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Real-Time Chat App</h2>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Send
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {chat.map((msg, index) => (
          <p key={index} style={{ background: '#f1f1f1', padding: '5px' }}>
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
