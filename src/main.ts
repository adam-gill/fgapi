
import { Application } from "@oak/oak";
import helloRouter from "./routes/hello.ts";
import { logger } from "./middleware/logger.ts";


const app = new Application();
app.use(logger);
app.use(helloRouter.routes());
app.use(helloRouter.allowedMethods());

const PORT = 8080;
console.log(`Server is running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
