import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";

const app = new Application();
const router = new Router()

app.use(async (ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*')
  ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  ctx.response.headers.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  await next()
})

app.use(async (ctx, next) => {
  const { pathname } = ctx.request.url
  if (pathname.endsWith(".js")) {
    const arr = pathname.split('/')
    const fileName = arr[arr.length - 1]
    const file = await Deno.readFile(`./${fileName}`);
    ctx.response.body = file
    ctx.response.type = 'text/javascript'
  }
  await next()
})

router.get('/', async ctx => {
  const readme = await Deno.readTextFile("./README.md");
  const html = await Deno.readTextFile('./index.html')
  const output = html.replace('[[readme]]', Marked.parse(readme).content)
  ctx.response.body = output
  ctx.response.type = 'html'
})

app.use(router.routes()).use(router.allowedMethods());

app.addEventListener("listen", ({ port, secure }) => {
  console.log(`Listening on: ${secure ? "https://" : "http://"}localhost:${port}`);
});

await app.listen({ port: 8888 });