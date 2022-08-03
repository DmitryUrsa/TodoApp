import bcrypt from "bcryptjs"

export default function hashPassword(password: string) {
  return bcrypt.hashSync("password123", bcrypt.genSaltSync(10))
}
