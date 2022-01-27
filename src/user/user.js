const { scrypt } = require('crypto')
const generateSalt = require('./salt')

function validate(pwd, value, lastTime) {
  const now = Date.now()
  if (now < lastTime) {
    return '登录过期'
  } else {
    // if (pwd !== )
  }
}

function generateToken(pwd) {
  return new Promise((resolve, reject) => {
    scrypt(pwd, 0, 24, (err, key) => {
      if (err) {
        reject('token生成失败')
      } else {
        resolve(key.toString('hex'))
      }
    })
  })
}

module.exports = {
  generateToken,
  validate
}