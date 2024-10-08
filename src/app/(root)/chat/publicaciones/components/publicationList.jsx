"use client";
import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/app/store';
import { getChatListGroupByPublicationAction } from '@/actions/chat';
import { getUserIdAction } from '@/actions/global';
import CustomLoading from '@/app/components/customLoading';
import ChatList from '../../components/chatList';

const inter = Inter({ subsets: ["latin"] });

const PublicationList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const {setChatId} = useChatStore();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const userId = await getUserIdAction();
        setUserId(userId);
        const data = await getChatListGroupByPublicationAction();
        setContacts(data)
      } catch (err) {
        setError('Error al obtener los contactos');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) return <CustomLoading />;
  if (error) return <p>{error}</p>;

  const handleClick = (publicationId) => {
    setChatId(publicationId)
    router.push(`/chat/publicaciones/${publicationId}`);
  };

  return (
    <div className='flex flex-col items-center justify-center bg-white rounded-xl drop-shadow-lg w-full p-4'>
      <h1 className={`${inter.className} w-full border-4 text-center text-blond text-white border-primary-orange bg-primary-orange rounded-lg p-4 mb-3`}>Mis chats</h1>
      <div className='w-full'>
        {contacts.length > 0 ? (
          contacts.map((contact) => {
            return (<ChatList key={contact.id} id={contact.id} s3Url={contact.s3Url} title={contact.title} type={'Publicación'} handleClick={handleClick}/>);
          })
        ) : (
          <p className='text-center text-blond'>No hay chats</p>
        )}
      </div>
    </div>
  );
};

export default PublicationList;
