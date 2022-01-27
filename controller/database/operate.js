const operate = function(model) {
  async function Insert(table, options) {
    const person = await model[table].create({...options})
    console.log('增加了新条目:', person.toJSON())
  }
  async function Select(table, options, where, include) {
    const person = await model[table].findAll({
      attributes: include ? { include: include } : options,
      where
    })
    console.log('查询结果:', JSON.stringify(person, null, 2))
    return person
  }
  async function Update(table, options, where) {
    await model[table].update(options, {
      where
    })
    console.log('更新了条目')
  }
  async function Delete(table, where) {
    await model[table].destroy({
      where
    })
    console.log('删除了条目')
  }
  return {
    Insert,
    Select,
    Update,
    Delete
  }
}

module.exports = operate