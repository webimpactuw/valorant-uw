import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Officers from "./pages/Officers";
<<<<<<< HEAD:valorant-site/src/App.js
=======
import CarouselPreview from './CarouselPreview'
>>>>>>> a539af89 (fix project folder structure):src/App.js

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD:valorant-site/src/App.js
=======
      <Route path="/carousel-preview" element={<CarouselPreview />} />
>>>>>>> a539af89 (fix project folder structure):src/App.js
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="officers" element={<Officers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
