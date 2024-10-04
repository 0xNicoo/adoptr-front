import Banner from "./components/banner";
import Maps from "./components/maps";

export default function LostsPage() {
  return (
    <div
      className="flex flex-col justify-between items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Banner />
      <div className="flex-grow w-full">
        <Maps />
      </div>
    </div>
  );
}


