async function validateRole(db, admin, params, sourceType) {
  const operate = db.operate
  const source = await operate['SelectOne'](sourceType, {
    [sourceType + '_id']: params
  })
  return admin?.associationAssociationId === source?.associationAssociationId
}
module.exports = {
  validateRole
}