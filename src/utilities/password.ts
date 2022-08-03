import bcrypt from "bcryptjs"

function hashPassword(password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export { hashPassword }
