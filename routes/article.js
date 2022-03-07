const Router = require('koa-router')
const router = new Router()
const ResModel = require('../model/response')
const { splitToken, validate } = require('../src/user/user')

// 返回所有文章列表
router.get('/article', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const count = ctx.querystring.split('=')[1]
  const content = await operate['Select']('article', ['article_id', 'name', 'avatar', 'abstract', 'association_id'], undefined , undefined, model.association)
  
  ctx.body = new ResModel().succeed(content.splice(count, 6))
})

// 返回用户文章收藏列表
router.get('/article/collect', async (ctx) => {
  try {
    const model = ctx.db.model
    const operate = ctx.db.operate
    const token = ctx.header['authorization']
    await validate(token)
    const { username } = splitToken(token)
    let collection = await operate['Select']('user', ['article_collect'], { username: username })
    if (collection.length) {
      collection = collection[0]['article_collect'].split(',')
      const content = await operate['Select']('article', ['article_id', 'name', 'avatar', 'abstract', 'association_id'], {
        article_id: collection
      }, undefined, model.association)
      ctx.body = new ResModel().succeed(content)
    } else {
      ctx.body = new ResModel().success([])
    }
  } catch(e) {
    console.log(e)
    ctx.body = new ResModel().err(undefined, e)
  }
})

// 返回社团文章列表
router.get('/:association/article', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const association = ctx.params.association
  try {
    const content = await operate['SelectOne']('association', {
      path: association
    }, {
      model: model['article'],
      attributes: ['article_id', 'name', 'avatar', 'abstract', 'association_id']
    })
    const articleAssociation = {}
    for (var key of Reflect.ownKeys(content.dataValues)) {
      if (key !== 'articles') {
        articleAssociation[key] = content[key]
      }
    }
    
    const articles = content.articles.map(item => {
      item.dataValues.association = articleAssociation
      return item
    })
    ctx.body = new ResModel().succeed(articles)
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e)
  }
})

// 返回指定文章
router.get('/article/:id?', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const article_id = ctx.params.id
  let content = await operate['Select']('article', null, {
    article_id
  }, undefined, model.association)
  
  ctx.body = new ResModel().succeed(content)
})

// 添加文章
router.put('/article', async (ctx) => {
  const operate = ctx.db.operate
  const article = ctx.request.body
  try {
    if (article.name === '' || !article.association_id) {
      throw new Error('必填字段为空')
    }
    await operate['Insert']('article', {
      association_id: article.association_id,
      associationAssociationId: article.association_id,
      name: article.name,
      avatar: article.avatar,
      abstract: article.abstract,
      content: article.content
    })
    ctx.body = new ResModel().succeed(undefined, '添加文章成功')
  } catch(e) {
    console.log(e)
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

module.exports = router