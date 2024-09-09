'use client';
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getAccessToken, getChatAction, getUserId, getProfileByUserIdAction } from '../actions';
import { useSearchParams } from 'next/navigation'

// esto estaba en la linea 122 <span className="font-bold">Username:</span>

const Chat = ({}) => {
  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null)
  const [receiver, setReceiver] = useState(null)
  const [userLogged, setUserLogged] = useState(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const chatId = searchParams.get('chat')
    getChat(chatId)
    connectWebSocket();
    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

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

  const sendMessage = (e) => {
    e.preventDefault();
    const msg = { 
      userReceiverEmail: receiver.user.email,
      userReceiverId: receiver.user.id,
      content: message,
      userSenderEmail: userLogged.user.email,
      userSenderId: userLogged.user.id,
      chatId: chat.id, 
    };
    setMessages((prevMessages) => [...prevMessages, msg]);
    if (client && connected) {
      client.publish({
        destination: '/app/chat', 
        body: JSON.stringify({ 
          userReceiverEmail: receiver.user.email,
          userReceiverId: receiver.user.id,
          content: message,
          userSenderEmail: userLogged.user.email,
          userSenderId: userLogged.user.id,
          chatId: chat.id, 
        }),
      });
    }
    setMessage('');
  };
  

  const getChat = async (id) =>{
    try{
      const chat = await getChatAction(id)
      const loggedUserId = await getUserId()
      setChat(chat)
      console.log(chat)
      setMessages(chat.messages);
      if(loggedUserId == chat.publicationUserId){
        setUserLogged(await getProfileByUserIdAction(loggedUserId))
        setReceiver(await getProfileByUserIdAction(chat.adopterUserId))
      }else{
        setUserLogged(await getProfileByUserIdAction(loggedUserId))
        setReceiver(await getProfileByUserIdAction(chat.publicationUserId))
      }
    }catch(err){
      console.log("ERROR AL OBTENER EL CHAT:", err)
    }
  }
  
  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <div className="bg-primary-orange p-4 text-white text-xl rounded-t-lg font-bold">
        {receiver ? (receiver.firstName + " " + receiver.lastName) : ""}
      </div>

      <div
        className="flex-1 p-4 overflow-y-auto bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/chat-background.png)' }}
      >
        <ul className="space-y-2">
          {messages.length != 0 ? console.log(messages) : console.log("vacio")}
          {userLogged && messages.length != 0  ?
                    messages.map((msg, index) => (
                      <li key={index} className={`flex ${msg.userSenderId == userLogged.user.id ? 'justify-end' : 'justify-start'} mb-2`}>
                        <div
                          className={`text-white p-3 rounded-full max-w-max ${msg.userSenderId == userLogged.user.id ? 'ml-2 bg-blue-500' : 'mr-2 bg-gray-500'}`}
                        >
                          {msg.content}
                        </div>
                      </li>
                    ))
          : <div></div>}

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

export default Chat;

