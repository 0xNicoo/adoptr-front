"use client"
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import AdoptionList from './adoption-list';

import PostConatiner from './post/postContainer';

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