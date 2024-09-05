import { useEffect, useState } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: 'http://localhost:8080/ws', // Cambia esto a tu URL del backend
      connectHeaders: {
        Authorization: `Bearer ${yourTokenHere}` // Agrega el token si es necesario
      },
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        stompClient.subscribe('/user/topic', (msg) => {
          const message = JSON.parse(msg.body);
          setMessages((prevMessages) => [...prevMessages, message]);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected');
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    client.publish({
      destination: '/app/chat',
      body: JSON.stringify({ username: 'User', message })
    });
    setMessage('');
  };

  return (
    <div>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.username}: {msg.message}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;