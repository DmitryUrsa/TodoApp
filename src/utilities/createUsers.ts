import { User } from "@prisma/client"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function createUsers(users: User[]) {
  return await prisma.user.createMany({
    data: users,
  })
}
