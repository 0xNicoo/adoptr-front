import React from 'react';

const Buttons = () => {
    return (
        <div className="flex flex-row justify-between mx-5">
            <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white">Atrás</button>
            <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white">Siguiente</button>
        </div>
    )
};

export default Buttons