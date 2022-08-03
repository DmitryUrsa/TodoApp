import bcrypt from "bcryptjs"

function hashPassword(password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}

export { hashPassword, comparePassword }
