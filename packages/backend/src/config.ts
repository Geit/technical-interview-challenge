import path from "path";

export const PORT = process.env.PORT || 3000;
export const DOG_DATA_DIRECTORY = path.resolve(__dirname, "../../../images");
export const ASSETS_BASE_PREFIX = "/assets";

export const ALLOWED_IMAGE_EXTENSIONS = [".jpg"];
