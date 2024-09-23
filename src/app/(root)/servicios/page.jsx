import ServiceContainer from "./components/serviceContainer";
import Banner from "./components/banner";

export default function ServicePage() {

  return (
    <div
      className="flex flex-col justify-between items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Banner />
      <ServiceContainer />
    </div>
  );
}
