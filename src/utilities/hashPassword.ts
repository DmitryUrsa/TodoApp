import bcrypt from "bcryptjs"

export default function hashPassword(password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
