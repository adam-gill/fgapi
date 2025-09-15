import { Context } from "@oak/oak";

export const sayHello = (ctx: Context) => {
  const ip = ctx.request.ip; 

  ctx.response.status = 200;
  ctx.response.body = { message: `hello idiot ${ip}`}
}
