import { PrismaClient } from "@prisma/client"
import { comparePassword } from "../utilities/password.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

interface Login {
  login: string
  password: string
}

const prisma = new PrismaClient()

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

  if (!process.env.JWT_SECRET)
    return { status: "error", message: "Ошибка сервера" }
  const token = jwt.sign(
    { login: foundUser.login, role: foundUser.role },
    process.env.JWT_SECRET
  )
  console.log(`JWT Token generated!`, token)
  return {
    status: "success",
    message: token,
  }
}

function verifyToken(token: string | undefined) {
  if (!process.env.JWT_SECRET)
    return { status: "error", message: "Ошибка сервера!" }
  if (!token) {
    return { status: "error", message: "Пустой токен" }
  }

  try {
    const verification = jwt.verify(token, process.env.JWT_SECRET)
    if (verification)
      return { message: "", status: "success", user: verification }
    return { status: "error", message: "Неизвестная ошибка" }
  } catch (error) {
    return { status: "error", message: "Неавторизирован" }
  }
}

export { logIn, verifyToken }
