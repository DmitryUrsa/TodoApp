import { PrismaClient } from "@prisma/client"
import { comparePassword } from "../utilities/password.js"
import jwt from "jsonwebtoken"

interface Login {
  login: string
  password: string
}

const prisma = new PrismaClient()

const JWT_SECRET =
  "8185c255a58aea590f306c1e7a8ab6d3a3aeb0f16cf9d61c8699fdb9b088d7c081058d"

/**
 * Checks login credentials and returns result or JWT token
 * @param user Login and password
 * @returns status: error or success; message: errorm message or JWT token
 */
async function logIn(user: Login) {
  const foundUser = await prisma.user.findFirst({
    where: { login: { equals: user.login, mode: "insensitive" } },
  })
  // Возможно не совсем безопасно говорить что потенциальному взломщику что он угадал с логином или паролем :)
  if (!foundUser)
    return {
      status: "error",
      message: "Пользователя с такиим логином не существует",
    }

  const passwordCorrect = comparePassword(user.password, foundUser.password)
  if (!passwordCorrect) return { status: "error", message: "Неверный пароль" }

  const maxAge = 3 * 60 * 60
  const token = jwt.sign(
    { id: foundUser.id, login: foundUser.login, role: foundUser.role },
    JWT_SECRET,
    {
      expiresIn: maxAge,
    }
  )
  console.log(`JWT Token generated!`, token)
  return {
    status: "success",
    message: token,
  }
}
