const Router = require('koa-router')
const router = new Router()
const ResModel = require('../model/response')
const { splitToken, validate } = require('../src/user/user')

// 返回所有公告列表
router.get('/announcement', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const count = ctx.querystring.split('=')[1]
  const content = await operate['Select']('announcement', ['announcement_id', 'name', 'avatar', 'abstract', 'associationAssociationId'], undefined, undefined, model.association)
  
  ctx.body = new ResModel().succeed(content.splice(count, count == undefined ? content.length : 6))
})

// 返回用户公告收藏列表
router.get('/announcement/collect', async (ctx) => {
  try {
    const model = ctx.db.model
    const operate = ctx.db.operate
    const token = ctx.header['authorization']
    await validate(token)
    const { username } = splitToken(token)
    let collection = await operate['Select']('user', ['announcement_collect'], { username: username })
    if (collection.length) {
      collection = collection[0]['announcement_collect'].split(',')
      const content = await operate['Select']('announcement', ['announcement_id', 'name', 'avatar', 'abstract', 'associationAssociationId'], {
        announcement_id: collection
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
router.get('/:association/announcement', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const association = ctx.params.association
  try {
    const content = await operate['SelectOne']('association', {
      path: association
    }, {
      model: model['announcement'],
      attributes: ['announcement_id', 'name', 'avatar', 'abstract', 'associationAssociationId']
    })
    const announcementAssociation = {}
    for (var key of Reflect.ownKeys(content.dataValues)) {
      if (key !== 'announcements') {
        announcementAssociation[key] = content[key]
      }
    }
    
    const announcements = content.announcements.map(item => {
      item.dataValues.association = announcementAssociation
      return item
    })
    ctx.body = new ResModel().succeed(announcements)
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e)
  }
})

// 返回指定公告
router.get('/announcement/:id?', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const announcement_id = ctx.params.id
  const content = await operate['Select']('announcement', null, {
    announcement_id: announcement_id
  }, undefined, model.association)

  ctx.body = new ResModel().succeed(content)
})

// 添加公告
router.put('/announcement', async (ctx) => {
  const operate = ctx.db.operate
  const announcement = ctx.request.body
  try {
    if (announcement.name === '' || !announcement.association_id) {
      throw new Error('必填字段为空')
    }
    await operate['Insert']('announcement', {
      associationAssociationId: announcement.association_id,
      name: announcement.name,
      avatar: announcement.avatar,
      abstract: announcement.abstract,
      content: announcement.content
    })
    ctx.body = new ResModel().succeed(undefined, '添加公告成功')
  } catch(e) {
    console.log(e)
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

module.exports = router