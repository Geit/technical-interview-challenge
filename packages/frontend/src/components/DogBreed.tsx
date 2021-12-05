import { Link, useParams } from "react-router-dom";
import { API_URL } from "../config";
import useFetch from "use-http";
import { DogBreed } from "@vetspire-tech-test/common/src/types";

const DogBreed: React.FC = () => {
  const { breedId } = useParams();
  const {
    loading,
    error,
    data: dogBreed,
  } = useFetch<DogBreed>(`${API_URL}/dogs/${breedId}`, {}, []);

  if (error) {
    return <div>An error occured while fetching the breed list.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dogBreed) {
    return <div>Could not find the dog breed you were looking for.</div>;
  }

  return (
    <section>
      <Link to="/">← Return to Listing</Link>

      <h2>{dogBreed.name}</h2>
      <img
        style={{ width: "100%" }}
        alt={`A portrait of a ${dogBreed.name}`}
        src={`${API_URL}${dogBreed.image}`}
      />
    </section>
  );
};

export default DogBreed;
