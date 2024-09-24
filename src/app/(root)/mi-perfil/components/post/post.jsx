"use client"
import React, { useState } from 'react';
import { Textarea, Button } from '@nextui-org/react';
import { handleCreatePost } from '../../actions';

const Post = ({onPostsChange}) => {
  const [description, setDescription] = useState('');

  const postNew = async () => {

    const formData = new FormData();
    formData.append('description', description);
    formData.append('date', new Date().toISOString());

    try {
      setDescription('');
      const post = await handleCreatePost(formData); 
      onPostsChange(post)
    }catch (error) {
      console.log('Error al crear post', error);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
    }
    
  }

  return (
    <div className='w-4/5'>
      <div className='bg-white rounded-lg'>
        <Textarea
          value={description}
          placeholder="Compartí tu experiencia"
          className="w-full rounded-lg text-lg mb-2"
          variant="bordered"
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className='rounded-lg mb-4'>
        <Button isDisabled={description == ''}
        onClick={postNew} className="w-full bg-primary-blue py-2 px-4 rounded-3xl transition-colors duration-300 text-white" auto>
          Publicar
        </Button>
      </div>
    </div>
  );
}

export default Post;
