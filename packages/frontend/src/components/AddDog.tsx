import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import { DogBreed } from "@vetspire-tech-test/common/src/types";

import * as classes from "./AddDog.module.scss";
import * as sharedClasses from "./SharedStyles.module.scss";
import { API_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import useFetch, { CachePolicies } from "use-http";

const AddDog: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File>();
  const [breedName, setBreedName] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { put } = useFetch<DogBreed | { error: string }>(API_URL, {
    cachePolicy: CachePolicies.NETWORK_ONLY,
  });

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e || !e.target || !e.target.files) {
      return;
    }

    setFile(e.target.files[0]);
  };

  const handleSubmit: FormEventHandler<
    HTMLFormElement | HTMLInputElement
  > = async (evt) => {
    evt.preventDefault();

    if (isSubmitting) {
      return false;
    }

    if (!breedName || breedName.length === 0) {
      setFormError("A breed name is required!");
      return false;
    }

    if (!file) {
      setFormError("A file is required!");
      return false;
    }

    setFormError(null);
    setIsSubmitting(true);

    const data = new FormData();
    data.append("file", file);

    try {
      const result = await put(`/dogs/${breedName}`, data);

      if (typeof result === "string") {
        // Types are incorrect for use-http. In the event the server doesn't return
        // JSON, then we just get a string back. We could fix this with by adding our own
        // request response generic/type and using that.
        setFormError(result);
      } else if ("error" in result) {
        setFormError(result.error);
      } else {
        navigate(`/breed/${result.id}`, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setFormError("Submission Failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={classes.addDogForm}>
      <Link to="/">← Return to Listing</Link>
      <h2>Add a Dog</h2>

      <form onSubmit={handleSubmit}>
        <div className={classes.formInput}>
          <label htmlFor="breedName">Breed Name</label>
          <input
            id="breedName"
            required
            type="text"
            onChange={(e) => setBreedName(e.target.value)}
            value={breedName}
          />
        </div>
        <div className={classes.formInput}>
          <label htmlFor="breedImage">Image</label>
          <input
            id="breedImage"
            required
            type="file"
            onChange={handleFileChange}
            accept=".jpg"
          />
        </div>

        <div className={classes.formError}>
          {/* We make sure this is always rendered to avoid layout shift on form error. */}
          {formError ? formError : <>&nbsp;</>}
        </div>

        <button
          className={sharedClasses.primaryButton}
          type="submit"
          disabled={isSubmitting}
        >
          Add Dog
        </button>
      </form>
    </section>
  );
};

export default AddDog;
