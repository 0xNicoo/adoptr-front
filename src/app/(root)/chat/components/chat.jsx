'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useSearchParams } from 'next/navigation'
import { Image } from '@nextui-org/react';
import { getAccessTokenAction } from '@/actions/auth';
import { getChatAction } from '@/actions/chat';
import { getUserIdAction } from '@/actions/global';
import { getProfilByUserIdAction } from '@/actions/profile';

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
    const token = await getAccessTokenAction()

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
      const loggedUserId = await getUserIdAction()
      setChat(chat)
      console.log(chat)
      setMessages(chat.messages);
      if(loggedUserId == chat.publicationUserId){
        setUserLogged(await getProfilByUserIdAction(loggedUserId))
        setReceiver(await getProfilByUserIdAction(chat.adopterUserId))
      }else{
        setUserLogged(await getProfilByUserIdAction(loggedUserId))
        setReceiver(await getProfilByUserIdAction(chat.publicationUserId))
      }
    }catch(err){
      console.log("ERROR AL OBTENER EL CHAT:", err)
    }
  }
  
return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <div className="bg-primary-orange p-4 text-white text-xl rounded-t-lg font-bold">
        {receiver ? (
          <Link href={`/perfiles?id=${receiver.user.id}`}>
            <div className="hover:underline">{receiver.firstName + " " + receiver.lastName}</div>
          </Link>
        ) : (
          ""
        )}
      </div>

      <div
        className="flex-1 p-4 overflow-y-auto bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/chat-background.png)' }}
      >
        <ul className="space-y-2">
          {userLogged && messages.length != 0 ?
          messages.map((msg, index) => (
            <li key={index} className={`flex items-center ${msg.userSenderId == userLogged.user.id ? 'justify-end' : 'justify-start'} mb-2`}>
              {msg.userSenderId != userLogged.user.id && receiver && receiver.s3Url ? (
                <div className='flex-shrink-0 mr-2'>
                  <Image className='rounded-full'
                    src={receiver.s3Url}
                    alt="Foto de perfil del contacto"
                    width={45}
                    height={45}  
                  />
                </div>
              ) : null}
              <div
                className={`text-white p-3 rounded-3xl max-w-[60%] min-w-[5%] break-words ${msg.userSenderId == userLogged.user.id ? 'ml-2 bg-blue-500' : 'mr-2 bg-gray-500 '}`}
              >
                {msg.content}
              </div>
            </li>
          ))
          : <div></div>
          }
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
          className="flex items-center justify-center p-2 rounded-full"
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