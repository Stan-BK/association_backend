const Router = require("koa-router")

const router = new Router()
router.get('/association/:name?', async (ctx, next) => {
  console.log(ctx.params)
  if (ctx.params != 'article') {
    next()
  } else {
    ctx.body = 'route association'
  }
})
router.get('/association/article', (ctx) => {
  console.log(ctx.response)
  ctx.body = 'route association/article'
})

module.exports = router