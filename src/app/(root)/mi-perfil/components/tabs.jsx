"use client"
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import AdoptionList from './adoption-list';
import ServiceList from './serviceList';
import PostConatiner from './post/postContainer';
import LostList from './lostList';


const MiPerfilTabs = ({ profile, adoptions, services, lost}) => {

  return (
    <Tabs aria-label="Options">
      <Tab key="comunidad" title="Comunidad">
        <PostConatiner profile={profile}/>
      </Tab>
      <Tab key="publicaciones" title="Publicaciones de mascotas">
        <AdoptionList adoptions={adoptions} />
      </Tab>
      <Tab key="servicios" title="Servicios">
        <ServiceList services={services} />
      </Tab>
      <Tab key="perdidas" title="Mascotas perdidas">
        <LostList lost={lost} />
      </Tab>
    </Tabs>
  );
};

export default MiPerfilTabs;