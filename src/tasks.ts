import { PrismaClient } from "@prisma/client"
import { DateTime } from "luxon"

const prisma = new PrismaClient()

type Post = {
  id?: string | undefined
  header: string | undefined
  description: string | undefined
  priority: string | undefined
  assignedUser: string | undefined
  endDate: string | undefined
  author: string | undefined
  status?: string | undefined
}

export async function createTask({
  header,
  description,
  priority,
  assignedUser,
  endDate,
  author,
}: Post) {
  if (
    !(
      header &&
      description &&
      priority &&
      priority != "0" &&
      assignedUser &&
      assignedUser != "0" &&
      endDate &&
      author
    )
  )
    return {
      status: "error",
      message: "One of the fields are empty",
    }

  const usersList = await prisma.task.create({
    data: {
      title: header,
      description: description,
      status: "pending",

      priority: parseInt(priority),
      assigned_user: parseInt(assignedUser),
      author: parseInt(author),

      start_date: DateTime.now().toISO(),
      end_date: DateTime.fromJSDate(new Date(endDate)).toISO(),
      last_updated: DateTime.fromJSDate(new Date(endDate)).toISO(),
    },
  })
  return usersList
}

export async function getTasks() {
  const tasksList = await prisma.task.findMany({})
  const usersList = await prisma.user.findMany({
    select: {
      first_name: true,
      second_name: true,
      login: true,
      id: true,
    },
  })

  return tasksList.map((task) => ({
    ...task,
    assigned_user: usersList.find((user) => user.id == task.assigned_user),
  }))
}

export async function updateTask({
  id,
  header,
  description,
  priority,
  assignedUser,
  endDate,
  author,
  status,
}: Post) {
  if (
    !(
      id &&
      header &&
      description &&
      priority &&
      priority != "0" &&
      assignedUser &&
      assignedUser != "0" &&
      endDate &&
      author &&
      status
    )
  )
    return {
      status: "error",
      message: "One of the fields are empty",
    }

  const usersList = await prisma.task.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title: header,
      description: description,
      status: status,

      priority: parseInt(priority),
      assigned_user: parseInt(assignedUser),
      author: parseInt(author),

      end_date: DateTime.fromJSDate(new Date(endDate)).toISO(),
      last_updated: DateTime.fromJSDate(new Date(endDate)).toISO(),
    },
  })
  return usersList
}
