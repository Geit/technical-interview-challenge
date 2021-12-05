import React from "react";
import { DogBreed } from "@vetspire-tech-test/common/src/types";

import * as classes from "./DogListing.module.scss";
import * as sharedClasses from "./SharedStyles.module.scss";
import { API_URL } from "../config";
import { Link } from "react-router-dom";
import useFetch from "use-http";

interface DogBreedItemProps {
  breed: DogBreed;
}

const DogBreedItem: React.FC<DogBreedItemProps> = ({ breed }) => {
  return (
    <Link to={`breed/${breed.id}`} className={classes.dogBreedItem}>
      <img
        alt={`A portrait of a ${breed.name}`}
        className={classes.dogBreedItem__portrait}
        src={`${API_URL}${breed.image}`}
      />
      <h3>{breed.name}</h3>
    </Link>
  );
};

const DogBreedListing: React.FC = () => {
  const {
    loading,
    error,
    data: dogBreeds,
  } = useFetch<DogBreed[]>(`${API_URL}/dogs`, {}, []);

  if (error) {
    return <div>An error occured while fetching the breed list.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dogBreeds || dogBreeds.length === 0) {
    return <div>No dog breeds were found.</div>;
  }

  return (
    <div className={classes.dogBreedList}>
      {dogBreeds.map((breed) => (
        <DogBreedItem key={breed.id} breed={breed} />
      ))}
    </div>
  );
};

const DogListingContainer: React.FC = () => {
  return (
    <section className={classes.dogBreedListContainer}>
      <div className={classes.dogBreedListContainer__headerRow}>
        <h2>Dog Breeds</h2>
        <Link to="/breed/add" className={sharedClasses.primaryButton}>
          ＋Add Doggo
        </Link>
      </div>
      <DogBreedListing />
    </section>
  );
};

export default DogListingContainer;
