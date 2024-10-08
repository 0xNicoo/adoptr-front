'use client'

import { useEffect, useState } from "react"

const MapFormWrapper = ({ setLatitude, setLongitude, latitude, longitude }) => {
    const [MapForm, setMapForm] = useState(null)

    useEffect(() =>{
        (async () => {
            if(typeof window !== 'undefined'){
              const mf = (await import('./mapForm')).default
              console.log(mf)
              setMapForm(() => mf)
            }
        })()
    },[])

    if (typeof window === 'undefined' || !MapForm) {
        return null;
    }
    
    return MapForm ? <MapForm longitude={longitude} latitude={latitude} setLongitude={setLongitude} setLatitude={setLatitude} /> : null;
}

export default MapFormWrapper