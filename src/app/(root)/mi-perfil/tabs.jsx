"use client"
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import AdoptionList from './adoption-list';
import Post from './post';
import PostList from './post-list';
import PostModal from './modal-eliminar';
import { useState } from 'react';

const MiPerfilTabs = ({ adoptions, posts, profile, onPostsChange}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleOpen = (postId) => {
    setSelectedPostId(postId);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPostId(null);
  };
  
  return (
    <Tabs aria-label="Options">
      <Tab key="novedades" title="Novedades">
        <Post onPostsChange={onPostsChange} />
        <PostList posts={posts} profile={profile} onOpen={handleOpen} />
        <PostModal isOpen={isOpen} onOpenChange={handleClose} postId={selectedPostId}/>
      </Tab>
      <Tab key="publicaciones" title="Publicaciones de mascotas">
        <AdoptionList adoptions={adoptions} />
      </Tab>
      <Tab key="servicios" title="Servicios">
        <Card>
          <CardBody>
            <p>No se encontraron servicios</p>
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  );
};

export default MiPerfilTabs;