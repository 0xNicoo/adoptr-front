"use client"
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import AdoptionList from './adoption-list';
import Post from './post';
import PostList from './post-list';
import PostModal from './modal-eliminar';
import { useState } from 'react';
import ServiceList from './serviceList';

const MiPerfilTabs = ({ adoptions, posts, profile, services, onPostsChange, removePost}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);


const MiPerfilTabs = ({ adoptions, profile}) => {

  
  return (
    <Tabs aria-label="Options">
      <Tab key="novedades" title="Novedades">
        <PostConatiner profile={profile}/>
      </Tab>
      <Tab key="publicaciones" title="Publicaciones de mascotas">
        <AdoptionList adoptions={adoptions} />
      </Tab>
      <Tab key="servicios" title="Servicios">
        <ServiceList services={services} />
      </Tab>
    </Tabs>
  );
};

export default MiPerfilTabs;