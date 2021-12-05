describe("Dog Breed Endpoints", () => {
  describe("GET /dogs/", () => {
    it.todo("Should return a list of dogs");
    it.todo("Should correctly respond when no dogs are in the datastore");
  });

  describe("GET /dogs/:breedId", () => {
    it.todo("Should return a single dog item");
    it.todo("Should return a 404 when a dog is not found");
    it.todo("Should return a 400 if an invalid breed ID is provided");
  });

  describe("PUT /dogs/:breedId", () => {
    it.todo("Should return a 400 error if the breedId is invalid");
    it.todo(
      "Should return a 400 error if the user does not provide an image file"
    );
    it.todo("Should add a new dog breed and return successfully");
    it.todo("Should overwrite an existing breed and return successfully");
  });
});
