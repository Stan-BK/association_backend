const { scrypt } = require('crypto')
const { Buffer } = require('buffer')
const generateSalt = require('./salt')
const salt = generateSalt()

function splitToken(token) { // 分别取出token三部分：用户名、有效期、签名
  const usersign = token.split(':')[0]
  const time = Buffer.from(token.split(':')[1], 'base64').toString('utf-8')
  const sign = token.split(':')[2]
  const username = Buffer.from(usersign, 'base64').toString('utf-8')
  return {
    usersign,
    username,
    time,
    sign
  }
}

function validate(token) { // 验证token
  return new Promise((resolve, reject) => {
    const now = Date.now()
    const { usersign, time, sign } = splitToken(token)
    if (now > time) {
      reject('登录过期')
    } else {
      scrypt(usersign + time, salt, 24, (err, key) => { // 异步调用加盐方法
        if (err) {
          reject(err)
        } else {
          if (key.toString('hex') === sign) {
            resolve('权限正确')
          } else {
            reject('权限错误')
          }
        }
      })
    }
  })
}

function generateToken(username, isKeepAlive) {
  return new Promise((resolve, reject) => {
    const nameStr = Buffer.from(username, 'utf-8').toString('base64')
    const time = isKeepAlive 
                  ? Date.now() + 30 * 24 * 60 * 60 * 1000
                  : Date.now() + 24 * 60 * 60 * 1000
    const timeStr = Buffer.from(String(time), 'utf-8').toString('base64')
    const str = nameStr + timeStr
    scrypt(str, salt, 24, (err, key) => { // 根据用户名和时间戳的base64转码结果，生成签名
      if (err) {
        reject('token生成失败')
      } else {
        resolve(`${nameStr}:${timeStr}:${key.toString('hex')}`) // 拼接成token返回
      }
    })
  })
}

module.exports = {
  splitToken,
  generateToken,
  validate
}