import React from 'react';
import Carousel from './EmblaCarousel.jsx'; // your EmblaCarousel component
import { EmblaCarousel } from './EmblaCarousel.jsx';

const OPTIONS = {}
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const CarouselPreview = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Carouseeeel Preview</h1>
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    </div>
  );
};

export default CarouselPreview;