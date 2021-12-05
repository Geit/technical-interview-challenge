import Router from "koa-router";

import dogs from "./dogs";

const router = new Router();

router.use("/dogs", dogs.routes(), dogs.allowedMethods());

export default router;
