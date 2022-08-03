import { User } from "@prisma/client"
import { PrismaClient } from "@prisma/client"
import hashPassword from "./password.js"

const prisma = new PrismaClient()
const users = [
  {
    first_name: "Dmitry",
    second_name: "Ursa",
    login: "DmitryUrsa",
    password: hashPassword("123"),
    role: "admin",
  },
  {
    first_name: "Bob",
    second_name: "Dylan",
    login: "bobtherobot200",
    password: hashPassword("anothercoolpass!"),
    role: "user",
  },
  {
    first_name: "Андрей",
    second_name: "Андрей",
    login: "aA200@mail.ru",
    password: hashPassword("PassWord10"),
    role: "user",
  },
  {
    first_name: "Denzel",
    second_name: "Curry",
    login: "Ultimate",
    password: hashPassword("Bloons1"),
    role: "user",
  },
] as User[]

async function createUsers(users: User[]) {
  return await prisma.user.createMany({
    data: users,
  })
}

async function clearUsers() {
  return await prisma.user.deleteMany({})
}

async function startRefreshUsers(users: User[]) {
  await clearUsers()
  const result = await createUsers(users)
  console.log(result)
}

startRefreshUsers(users)
