import React, {useEffect, useRef} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import eg from './/assets/valorant_sponsors/evil_geniuses_sponsor.png'
import ifinikey from './/assets/valorant_sponsors/infinikey_sponsor.png'
import  redbull from './/assets/valorant_sponsors/redbull_sponsor.png'
import tsm from './/assets/valorant_sponsors/tsm_sponsor.png'
import './Carousel.css'; 
export function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()])
  const images = [eg,ifinikey,redbull,tsm]
  const autoplay = useRef(
    Autoplay({delay: 500, stopOnInteraction: false}) 
  )
  useEffect(() => {
    return () => autoplay.current.stop();
  }, []);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {images.map((src, index) => (
          <div className="embla__slide" key={index}>
            <img src={src} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}