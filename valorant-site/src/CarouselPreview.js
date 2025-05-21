import React from 'react';
import EmblaCarousel from './EmblaCarousel';
import eg from './/assets/valorant_sponsors/eg_sponsor.jpg'
import ifinikey from './/assets/valorant_sponsors/ifk_sponsor.png'
import  redbull from './/assets/valorant_sponsors/redbull_sponsor.png'
import tsm from './/assets/valorant_sponsors/tsm_sponsor.svg'
import msi from './/assets/valorant_sponsors/msi.png'
import com from './/assets/valorant_sponsors/com.png'
import razer from './/assets/valorant_sponsors/razer_sponsor.jpg'
const OPTIONS = {loop: true, draggable: false}
const SLIDES = [eg,ifinikey,redbull,tsm,msi,com,razer]

const CarouselPreview = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Carousel Preview</h1>
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    </div>
  );
};

export default CarouselPreview;