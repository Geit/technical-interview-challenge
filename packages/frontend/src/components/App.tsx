import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import * as classes from "./App.module.scss";
import DogListingContainer from "./DogListing";
import DogBreed from "./DogBreed";
import AddDog from "./AddDog";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className={classes.appContainer}>
        <h1>Vetspire Technical Test</h1>

        <Routes>
          <Route path="/" element={<DogListingContainer />} />
          <Route path="/breed/:breedId" element={<DogBreed />} />
          <Route path="/breed/add" element={<AddDog />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
