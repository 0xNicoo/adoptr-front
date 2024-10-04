"use client";
import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/app/store';
import { getChatListAction } from '@/actions/chat';
import { getUserIdAction } from '@/actions/global';
import { getProfilByUserIdAction } from '@/actions/profile';

const inter = Inter({ subsets: ["latin"] });

const ChatList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profilePics, setProfilePics] = useState([]); 
  const router = useRouter();

  const { setChatId } = useChatStore();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const userId = await getUserIdAction();
        setUserId(userId);
        console.log("User ID:", userId);

        const data = await getChatListAction();
        if (Array.isArray(data)) {
          setContacts(data);

          const profiles = await Promise.all(
            data.map(async (contact) => {
              const contactUserId = Number(userId) === Number(contact.publicationUserId)
                ? contact.adopterUserId
                : contact.publicationUserId;
              const profileData = await getProfilByUserIdAction(contactUserId);
              return { contactUserId, profilePic: profileData.s3Url };
            })
          );

          const profileMap = profiles.reduce((acc, { contactUserId, profilePic }) => {
            acc[contactUserId] = profilePic;
            return acc;
          }, {});
          setProfilePics(profileMap);

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
    setChatId(contactId);
    router.push(`/chat?chat=${contactId}`);
  };

  return (
    <div className='flex flex-col w-64 mr-4 mt-4'>
      <div className='bg-secondary-blue rounded-xl flex items-center justify-center py-4'>
      <h1 className={`${inter.className} text-center text-lg text-white`}>Mis mensajes</h1>
      </div>
      <div className='w-full'>
        {contacts.length > 0 ? (
          contacts.map((contact) => {
            let displayText;
            const contactUserId = Number(userId) === Number(contact.publicationUserId)
              ? contact.adopterUserId
              : contact.publicationUserId;

            if (Number(userId) === Number(contact.publicationUserId)) {
              displayText = `${contact.adopterUserName}`;
            } else {
              displayText = `${contact.publicationUserName}`;
            }

            const profilePic = profilePics[contactUserId];

            return (
              <div
                key={contact.id}
                className='flex items-center justify-between py-2 pl-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 cursor-pointer'
                onClick={() => handleClick(contact.id)}
              >
                <div className="flex items-center gap-3">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Foto de perfil"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div> // Placeholder si no hay imagen
                  )}
                  <div className='flex-1'>
                    <p className={`${inter.className} text-sm text-gray-600`}>{displayText}</p>
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
