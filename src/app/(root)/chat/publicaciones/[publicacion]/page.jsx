"use client";
import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import { useChatStore } from '@/app/store';
import { getChatsByPublicationIdAction } from '@/actions/chat';
import { getUserIdAction } from '@/actions/global';
import CustomLoading from '@/app/components/customLoading';
import ChatList from '../../components/chatList';

const inter = Inter({ subsets: ["latin"] });

const UserList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const pathname = usePathname()
  const {setChatId} = useChatStore();

  useEffect(() => {
    const fetchContacts = async () => {
        const pathParts = pathname.split('/');
        const dynamicId = pathParts[pathParts.length - 1];
        try {
        const userId = await getUserIdAction();
        setUserId(userId);
        const data = await getChatsByPublicationIdAction(dynamicId);
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

  const handleClick = (contactId) => {
    setChatId(contactId)
    router.push(`/chat?chat=${contactId}`);
  };

  return (
    <div className='flex flex-col items-center justify-center bg-white rounded-xl drop-shadow-lg w-full p-4'>
      <h1 className={`${inter.className} w-full border-4 text-center text-blond text-white border-primary-orange bg-primary-orange rounded-lg p-4 mb-3`}>Mis chats</h1>
      <div className='w-full'>
        {contacts.length > 0 ? (
          contacts.map((contact) => {
            const interlocutor = userId == contact.interlocutorUserProfile.id ? contact.publicationUserProfile : contact.interlocutorUserProfile
            return (
            <ChatList
              key={contact.id}
              id={contact.id} 
              s3Url={interlocutor.s3Url} 
              title={interlocutor.firstName + " " + interlocutor.lastName} 
              type={'Usuario'} 
              handleClick={handleClick}
            />);
          })
        ) : (
          <p className='text-center text-blond'>No hay chats</p>
        )}
      </div>
    </div>
  );
};

export default UserList;
