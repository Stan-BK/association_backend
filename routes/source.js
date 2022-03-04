const Router = require('koa-router')
const router = new Router()
const resModel = require('../controller/index')
const { generateToken, validate } = require('../src/user/user')
const { formUploader, uploadToken, putExtra } = require('../src/qiniu')
const buffer = require('buffer')

router.put('/source', async (ctx) => {
  try {
    const model = ctx.db.model
    const operate = ctx.db.operate
    const token = ctx.header['authorization']
    const source = ctx.request.files.source
    const source_name = ctx.request.body.source_name
    await validate(token) 
    const response = await new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, source_name, source.path, putExtra, function(respErr,
        respBody, respInfo) {
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode == 200) {
          console.log('上传资源:', respBody);
        } else {
          console.log('上传资源响应状态码:', respInfo.statusCode);
          console.log('上传资源:', respBody);
        }
        resolve(respBody)
      });
    })
    ctx.body = new resModel().succeed('http://source.geminikspace.com/' + response.key)
  } catch(e) {
    ctx.body = new resModel().err(undefined, e)
  }
})

module.exports = router