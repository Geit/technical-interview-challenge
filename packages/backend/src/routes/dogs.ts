import Router from "koa-router";
import fs from "fs/promises";
import path from "path";
import koaBody, { IKoaBodyOptions } from "koa-body";

import {
  ALLOWED_IMAGE_EXTENSIONS,
  ASSETS_BASE_PREFIX,
  DOG_DATA_DIRECTORY,
} from "../config";
import { DogBreed } from "@vetspire-tech-test/common/src/types";

const router = new Router();

const convertFileNameToId = (filename: string) => {
  return filename.replace(/\.\w+$/, ""); // Clear the extension
};

const convertFileNameToBreed = (filename: string) => {
  return filename
    .replace(/\.\w+$/, "") // Clear the extension
    .split(/[_-]/) // Split any underscores
    .map((part) => part[0].toUpperCase() + part.substring(1)) // Make the first letter of every word a capital
    .join(" "); // Join together as spaces.
};

const normalizeBreedToId = (breed: string) => {
  return breed
    .trim()
    .split(/[\s]+/) // Split any whitespace
    .map((part) => part.toLowerCase()) // lowercase each part
    .join("_"); // Join together as underscores.
};

const getDogBreeds = async (): Promise<DogBreed[]> => {
  const rawFolderContents = await fs.readdir(DOG_DATA_DIRECTORY, {
    withFileTypes: true,
  });

  const files = rawFolderContents.filter((f) => f.isFile());

  const dogBreedsData = files.map(async (f) => {
    const filePath = path.join(DOG_DATA_DIRECTORY, f.name);
    const fileStats = await fs.stat(filePath);

    const dog: DogBreed = {
      id: convertFileNameToId(f.name),
      name: convertFileNameToBreed(f.name),
      image: path.join(ASSETS_BASE_PREFIX, f.name),
      lastModified: fileStats.mtime.toISOString(),
    };

    return dog;
  });

  const dogs = await Promise.all(dogBreedsData);
  return dogs;
};

router.get("/", async (ctx, next) => {
  try {
    ctx.body = await getDogBreeds();
  } catch (err) {
    console.error(err);

    ctx.status = 500;
    ctx.body = { error: "An unknown error occured" };
  }

  await next();
});

router.get("/:breedId", async (ctx, next) => {
  const { breedId } = ctx.params;

  // Shouldn't happen, but should still be handled just in case.
  if (!breedId) {
    ctx.status = 400;
    ctx.body = { error: "Required parameter breedId was missing" };

    await next();
    return;
  }

  try {
    // If we had a real datastore this would be different, but alas.
    const dogBreeds = await getDogBreeds();

    const foundBreed = dogBreeds.find((dog) => dog.id === breedId);

    if (!foundBreed) {
      ctx.status = 404;
      ctx.body = { error: "Dog breed not found" };
    } else {
      ctx.body = foundBreed;
    }
  } catch (err) {
    console.error(err);

    ctx.status = 500;
    ctx.body = { error: "An unknown error occured" };
  }

  await next();
});

// https://www.npmjs.com/package/koa-body#options
const bodyParseOptions: IKoaBodyOptions = {
  multipart: true,
  formidable: {
    multiples: false,
    keepExtensions: true,
  },
};

/**
 * Our datastorage mechanism here only really supports storing a single image per dog breed,
 * So we're setting this up in a somewhat non-RESTful manner whereby PUT can create new dog breeds.
 * We also have no storage mechanism for dog breed names, so all of that is encoded into the ID.
 */
router.put("/:breedId", koaBody(bodyParseOptions), async (ctx, next) => {
  const { breedId } = ctx.params;

  const realBreedId = normalizeBreedToId(breedId || "");

  // Shouldn't happen, but should still be handled just in case.
  if (!realBreedId || realBreedId.length === 0) {
    ctx.status = 400;
    ctx.body = { error: "Required parameter breedId was missing" };

    await next();
    return;
  }

  try {
    // ctx.request.files

    // We should validate the file a little more properly here.
    // For example, we should mime-sniff it and make sure it's actually a valid image etc.
    // However, due to time constraint, we're just going to trust that it's valid and move the file
    // to our DOG_DATA_DIRECTORY.
    if (!ctx.request.files || Object.keys(ctx.request.files).length === 0) {
      ctx.status = 400;
      ctx.body = { error: "Required file was missing" };

      await next();
      return;
    }

    // Converting File[] | File into File[], as we're only going to use the first one anyway.
    const uploadedFiles = Object.values(ctx.request.files).flatMap((f) => f);

    const parsedPath = path.parse(uploadedFiles[0].path);

    if (!ALLOWED_IMAGE_EXTENSIONS.includes(parsedPath.ext)) {
      ctx.status = 400;
      ctx.body = { error: "Uploaded image has invalid extension" };
    }

    await fs.rename(
      uploadedFiles[0].path,
      path.join(DOG_DATA_DIRECTORY, "/", `${realBreedId}${parsedPath.ext}`)
    );

    const dogBreeds = await getDogBreeds();

    const foundBreed = dogBreeds.find((dog) => dog.id === realBreedId);

    if (!foundBreed) {
      ctx.status = 500;
      ctx.body = { error: "Dog breed not found after upload" };
    } else {
      ctx.body = foundBreed;
    }
  } catch (err) {
    console.error(err);

    ctx.status = 500;
    ctx.body = { error: "An unknown error occured" };
  }

  await next();
});

export default router;
