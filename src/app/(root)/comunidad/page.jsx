"use client";
import React from 'react';
import PostContainer from './components/post/postContainer';
import ChatList from './components/chatList/chatList';

const Comunidad = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl flex justify-between">
        <div className="hidden lg:block lg:w-[250px]" />
        <div className="flex-1 max-w-4xl px-4">
          <PostContainer />
        </div> 
        <div className="hidden lg:block lg:w-[250px]">
          <div className="lg:sticky top-4 lg:h-screen">
            <ChatList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comunidad;

