import Koa from "koa";
import logger from "koa-logger";
import mount from "koa-mount";
import serve from "koa-static";
import cors from "@koa/cors";

import {
  ALLOWED_IMAGE_EXTENSIONS,
  ASSETS_BASE_PREFIX,
  DOG_DATA_DIRECTORY,
  PORT,
} from "./config";
import router from "./routes";

const app = new Koa();

app.use(logger());
app.use(
  mount(
    ASSETS_BASE_PREFIX,
    serve(DOG_DATA_DIRECTORY, { extensions: ALLOWED_IMAGE_EXTENSIONS })
  )
);

app.use(
  cors({
    maxAge: 3600,
    origin: "*",
  })
);
app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(PORT, () => {
  console.log("Server listening");
});

server.keepAliveTimeout = 60 * 1000;
