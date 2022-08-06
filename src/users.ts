import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function getUsers() {
  const usersList = await prisma.user.findMany({
    where: {},
    select: {
      first_name: true,
      second_name: true,
      login: true,
      id: true,
    },
  })
  return usersList
}
