'use client'

import { useEffect, useState } from "react"

const MapPreviewWrapper = ({ latitude, longitude }) => {
    const [MapPreview, setMapPreview] = useState(null)

    useEffect(() =>{
        (async () => {
            if(typeof window !== 'undefined'){
              const mp = (await import('./mapPreview')).default
              setMapPreview(() => mp)
            }
        })()
    },[])

    if (typeof window === 'undefined' || !MapPreview) {
        return null;
    }
    
    return MapPreview ? <MapPreview longitude={longitude} latitude={latitude} /> : null;
}

export default MapPreviewWrapper