async function testDatabaseConnect(sequelize) { // 测试sequelize连接
  try {
    await sequelize.authenticate()
    console.log('Sequelize已成功连接数据库')
    syncModel(sequelize)
  } catch (error) {
    console.error('Sequelize无法连接到数据库，原因:', error)
  }
}

async function syncModel(sequelize) { // 同步sequelize模型
  try {
    await sequelize.sync({ alter: true });
    console.log("所有模型均已成功同步.");
  } catch(error) {
    console.log("模型同步出错，原因:", error)
  }
}

module.exports.testDatabaseConnect = testDatabaseConnect