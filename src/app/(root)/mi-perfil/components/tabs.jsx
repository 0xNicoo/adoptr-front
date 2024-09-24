"use client"
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import AdoptionList from './adoption-list';
import ServiceList from './serviceList';
import PostConatiner from './post/postContainer';


const MiPerfilTabs = ({ profile, adoptions, services}) => {

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