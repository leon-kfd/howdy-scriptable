import { Application, Router } from "https://deno.land/x/oak/mod.ts"
// import { marked } from "npm:marked@7";
import { Marked } from 'https://raw.githubusercontent.com/ubersl0th/markdown/master/mod.ts'

const app = new Application();
const router = new Router();

const readme = await Deno.readTextFile("./README.md");
// const readmeHtml = marked.parse(readme)
const readmeHtml = Marked.parse(readme).content


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
  const html = await Deno.readTextFile('./index.html')
  const output = html.replace('[[readme]]', readmeHtml)
  ctx.response.body = output
  ctx.response.type = 'html'
})

app.use(router.routes()).use(router.allowedMethods());

app.addEventListener("listen", ({ port, secure }) => {
  console.log(`Listening on: ${secure ? "https://" : "http://"}localhost:${port}`);
});

await app.listen({ port: 8888 });