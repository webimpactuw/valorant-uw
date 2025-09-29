
import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import './Carousel.css'; 
const EmblaCarousel = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({stopOnInteraction: false, draggable: false})
  ])
  useEffect(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll
    if (!autoScroll) return
  }, [emblaApi])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((src,index) => (
            <div className="embla__slide" key={index}>
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="embla__slide__img"
            />
          </div>
          ))}
        </div>
      </div>   
      </div>
  )
}

export default EmblaCarousel
