'use client';
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getAccessToken } from '../actions';
import { useChatStore } from '@/app/store';

const Chatt = ({}) => {
  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const username = 'Usuario'; 
  const {chatId} = useChatStore()

  useEffect(() => {
    
    const connectWebSocket = async () => {
      const token = await getAccessToken()

      const sock = new SockJS('http://localhost:8080/ws');
      const stompClient = new Client({
        webSocketFactory: () => sock,
        connectHeaders: {
          Authorization: `Bearer ${token}`, 
        },
        onConnect: () => {
          console.log('Connected');
          setConnected(true);
          stompClient.subscribe('/user/queue', (message) => {
            const body = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, body]);
          });
        },
        onDisconnect: () => {
          console.log('Disconnected');
          setConnected(false);
        },
        onStompError: (frame) => {
          console.error('Error:', frame.headers['message']);
        },
      });

      stompClient.activate();
      setClient(stompClient);
    };

    connectWebSocket();

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault()
    if (client && connected) {
      client.publish({
        destination: '/app/chat', 
        body: JSON.stringify({ 
          recipientId: 3,
          content: message,
          senderId: 1,
          chatId: 1, 
        }),
      });
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      {/* Encabezado del Chat */}
      <div className="bg-primary-orange p-4 text-white text-xl rounded-t-lg font-bold">
        {username}
      </div>

      <div
        className="flex-1 p-4 overflow-y-auto bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/chat-background.png)' }}
      >
        <ul className="space-y-2">
          {messages.map((msg, index) => (
            <li key={index} className={`flex ${msg.username === 'User' ? 'justify-end' : 'justify-start'} mb-2`}>
              <div
                className={`bg-blue-500 text-white p-3 rounded-full max-w-max ${msg.username === 'User' ? 'ml-2' : 'mr-2'}`}
              >
                <span className="font-bold">{msg.username}:</span> {msg.message}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={sendMessage} className="p-4 flex items-center border-t-0">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-2 rounded-full border-none"
        />
        <button
          type="submit"
          className={` flex items-center justify-center p-2 rounded-full`}
        >
          <img
            src="/images/send.png"
            alt="Send"
            className="w-6 h-6"
          />
        </button>
      </form>
    </div>
  );
};

export default Chatt;

