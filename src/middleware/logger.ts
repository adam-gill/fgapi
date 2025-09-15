import { Context } from "@oak/oak";
import { getStatusColor } from "../util/getStatusColor.ts";

export async function logger(ctx: Context, next: () => Promise<unknown>) {
  await next();
  const method = ctx.request.method;
  const url = ctx.request.url.pathname;
  const status = ctx.response.status;
  console.log(`${getStatusColor(status)} [${method}] ${url} - ${status}`);
}