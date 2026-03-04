import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Officers from "./pages/Officers";
import NotFound from "./pages/NotFound";
import CarouselPreview from './CarouselPreview'

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/carousel-preview" element={<CarouselPreview />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="officers" element={<Officers />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
