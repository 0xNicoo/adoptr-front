"use client";
import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { useRouter } from 'next/navigation';
import { getChatList, getUserId } from "../actions";

const inter = Inter({ subsets: ["latin"] });

const ChatList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const userProfile = await getUserId();
        const userId = userProfile.user.id;
        setUserId(userId);
        console.log("User ID:", userId);

        const data = await getChatList();

        if (Array.isArray(data)) {
          setContacts(data);
        } else {
          console.error("Unexpected data format or no data:", data);
          setContacts([]);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
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
    router.push(`/chat/${contactId}`);
  };

  //TODO: AGREGAR A DONDE QUIERO QUE VAYA

  return (
    <div className='flex flex-col items-center justify-center bg-white rounded-xl drop-shadow-lg w-full p-4'>
      <h1 className={`${inter.className} w-full border-4 text-center text-blond text-white border-primary-orange bg-primary-orange rounded-lg p-4 mb-3`}>Mis Mensajes</h1>
      <div className='w-full'>
        {contacts.length > 0 ? (
          contacts.map((contact) => {
            let displayText;
            if (Number(userId) === Number(contact.publicationUserId)) {
              displayText = `Adoptante: ${contact.adopterUserName}`;
            } else {
              displayText = `Publicado por: ${contact.publicationUserName}`;
            }
            return (
              <div
                key={contact.id}
                className='flex items-center justify-between bg-gray-100 p-4 mb-2 rounded-3xl shadow-md transition-colors duration-200 hover:bg-gray-200 cursor-pointer'
                onClick={() => handleClick(contact.id)}
              >
                <div className='flex-1'>
                  <p className={`${inter.className} text-sm text-gray-600`}>{displayText}</p>
                </div>
                <div className='flex-1 text-right'>
                  <p className={`${inter.className} text-sm text-gray-600`}>Publicación: {contact.publication.title}</p>
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
