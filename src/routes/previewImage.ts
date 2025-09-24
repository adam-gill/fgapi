import { Router } from "@oak/oak";
import { generatePreviewImage } from "../controllers/previewImageController.ts";

const router = new Router();
router
  .post("/previewImage", generatePreviewImage)

export default router;
