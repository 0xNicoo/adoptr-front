"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Image, Button, Card } from "@nextui-org/react";
import ClearIcon from '@mui/icons-material/Clear';
import { createPostAction } from '@/actions/post';
import CollectionsIcon from '@mui/icons-material/Collections';
import { Inter } from "next/font/google";
import { getProfileAction } from '@/actions/profile';

const inter = Inter({ subsets: ["latin"] });

const Post = ({ onPostsChange, profile }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [nameImage, setNameImage] = useState('');
  const [fileImage, setFileImage] = useState(null);
  const textareaRef = useRef(null);  

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      setNameImage(file.name);
    }
  };

  const postNew = async () => {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', fileImage);
    formData.append('date', new Date().toISOString());

    try {
      setDescription('');
      setImage('');
      setNameImage('');
      setFileImage(null);
      const post = await createPostAction(formData);
      onPostsChange(post);
    } catch (error) {
      console.log('Error al crear post', error);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";  
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;  
    }
  }, [description]); 

  const isSingleLine = description.split('\n').length == 1;

  return (
    <div>
      <form>
      <div className="w-full border border-gray-200 rounded-xl bg-white">
          <div className={`px-2 py-2 bg-white rounded-t-xl text-sm border-b flex space-x-2 ${isSingleLine ? 'items-start' : 'items-center'}`}>
            <div className='flex-shrink-0'>
              <Image
                alt="Foto de perfil del usuario"
                height={40}
                width={40}
                src={profile.s3Url}
                className='rounded-full'
              />
            </div>
            <div className="w-full">
              <textarea
                id="editor"
                ref={textareaRef}  
                rows="2"
                className={`${inter.className} w-full text-black bg-white focus:outline-none resize-none overflow-hidden break-words`}
                placeholder="Compartí tu experiencia"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          {image && (
            <div className="px-2 py-2">
              <Card
                radius="md"
                className="relative border border-gray-100 shadow-none mt-2"
                style={{ width: "fit-content" }}
              >
                <Image
                  alt="Imagen seleccionada"
                  height={250}
                  src={image}
                  width={250}
                />
                <ClearIcon
                  className="absolute top-0 right-0 m-2 text-gray-100 cursor-pointer z-50 shadow-none"
                  onClick={() => setImage('')}
                />
              </Card>
            </div>
          )}
          <div className="flex items-center justify-between rounded-lg px-1 py-1 border-b">
            <div className="flex items-center space-x-1 hover:bg-gray-100 rounded-lg px-2 py-2">
              <input type="file" id="custom-input" onChange={imageHandler} hidden />
              <label htmlFor="custom-input" className='flex flex-row items-center cursor-pointer gap-1 text-secondary-blue'>
                <CollectionsIcon/>
                <p className={`${inter.className} text-xs cursor-pointer`}>Foto/Vídeo</p>
              </label>
            </div>
          </div>
        </div>
        <div className='rounded-lg mb-2 mt-2'>
          <Button isDisabled={description === ''} onClick={postNew} className="w-full bg-primary-blue py-2 px-4 rounded-3xl transition-colors duration-300 text-white" auto>
            Publicar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Post;
