'use client';
import React, { useState } from 'react';

const Chatt = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const username = 'Usuario'; // Cambia esto por el nombre del usuario con el que estás hablando

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { username: 'User', message }]);
      setMessage('');
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

      <form onSubmit={handleSubmit} className="p-4 flex items-center border-t-0">
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

