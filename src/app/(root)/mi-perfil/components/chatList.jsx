"use client";
import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/app/store';
import { getChatListGroupByUserAction } from '@/actions/chat';

const inter = Inter({ subsets: ["latin"] });

const ChatList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const { setChatId } = useChatStore();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getChatListGroupByUserAction();
        setContacts(data);
      } catch (err) {
        setError('Error al obtener los contactos');
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) return <p>Cargando contactos...</p>;
  if (error) return <p>{error}</p>;

  const handleClick = (contactId) => {
    setChatId(contactId);
    router.push(`/chat?chat=${contactId}`);
  };

  return (
    <div className='flex flex-col w-64 mr-4 mt-0'>
      <div className='bg-secondary-blue rounded-xl flex items-center justify-center py-4'>
      <h1 className={`${inter.className} text-center text-lg text-white`}>Mis mensajes</h1>
      </div>
      <div className='w-full'>
        {contacts.length > 0 ? (
          contacts.map((contact) => {
            return (
              <div
                key={contact.chatId}
                className='flex items-center justify-between py-2 pl-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 cursor-pointer'
                onClick={() => handleClick(contact.chatId)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={contact.profile.s3Url}
                    alt="Foto de perfil"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className='flex-1'>
                    <p className={`${inter.className} text-sm text-gray-600`}>{contact.profile.firstName} {contact.profile.lastName}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className='text-center text-blond'>No hay contactos</p>
        )}
      </div>
    </div>
  );
};

export default ChatList;
