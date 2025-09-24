
import { Application } from "@oak/oak";
import helloRouter from "./routes/hello.ts";
import previewImageRouter from "./routes/previewImage.ts"
import { logger } from "./middleware/logger.ts";

const PORT = Number(Deno.env.get("PORT"));
const HOST = Deno.env.get("HOST");
const BASE_URL = Deno.env.get("BASE_URL");

const app = new Application();
app.use(logger);
app.use(helloRouter.routes());
app.use(helloRouter.allowedMethods());
app.use(previewImageRouter.routes());
app.use(previewImageRouter.allowedMethods());


console.log(`Server is running on ${BASE_URL}:${PORT}`);
await app.listen({ hostname: HOST, port: PORT });
