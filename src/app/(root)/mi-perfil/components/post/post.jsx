"use client"
import React, { useState } from 'react';
import {Image, Button, Card} from "@nextui-org/react";
import ClearIcon from '@mui/icons-material/Clear';
import { createPostAction } from '@/actions/post';
import CollectionsIcon from '@mui/icons-material/Collections';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Post = ({onPostsChange}) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [nameImage, setNameImage] = useState('');
  const [fileImage, setFileImage] = useState(null);
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contenido publicado:', content);
  };

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
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
    }
  }

  return (
    <div className='w-4/5'>
    <form onSubmit={handleSubmit}>
      <div className="w-full mb-4 border border-gray-200 rounded-xl bg-white">
        <div className="px-2 py-2 bg-white rounded-t-xl border-b grid
        text-sm
        [&>textarea]:text-inherit
        after:text-inherit
        [&>textarea]:resize-none
        [&>textarea]:overflow-hidden
        [&>textarea]:[grid-area:1/1/2/2]
        after:[grid-area:1/1/2/2]
        after:whitespace-pre-wrap
        after:invisible
        after:content-[attr(data-cloned-val)_'_']
        after:border"
        data-cloned-val={description}
      >
        <label htmlFor="editor" className="sr-only">Publicar</label>
          <textarea
            id="editor"
            rows="2"
            className={`${inter.className} w-full text-black bg-white focus:outline-none`}
            placeholder="Compartí tu experiencia"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onInput={(e) => e.target.parentNode.dataset.clonedVal = e.target.value}
          />
          {image ? (
            <>
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
            </>
          ) : (
            <div></div>
          )}
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse">
            <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
              <input type="file" id="custom-input" onChange={imageHandler} hidden />
              <label htmlFor="custom-input">
                <CollectionsIcon className="text-secondary-blue" />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className='rounded-lg mb-4 mt-2'>
        <Button isDisabled={description === ''} onClick={postNew} className="w-full bg-primary-blue py-2 px-4 rounded-3xl transition-colors duration-300 text-white" auto>
          Publicar
        </Button>
      </div>
    </form>
    </div>
  );
}

export default Post;
