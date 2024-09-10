import PublicationFavoriteList from "./components/publicationList";

import SectionAdop from "./components/sectionadop";

export default function FavoritePage() {

  return (
    <div
      className="flex flex-col justify-between items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/back.png')", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <SectionAdop />
      <PublicationFavoriteList />
    </div>
  );
}
