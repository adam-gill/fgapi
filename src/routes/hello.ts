import { Router } from "@oak/oak";
import { sayHello } from "../controllers/helloController.ts";

const router = new Router();
router
  .get("/hello", sayHello)

export default router;
