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
      message: "Одно из полей пустое",
    }

  const data = await prisma.task.create({
    data: {
      title: header,
      description: description,
      status: "pending",

      priority: parseInt(priority),
      assigned_user: parseInt(assignedUser),
      author: parseInt(author),

      start_date: DateTime.now().toISO(),
      end_date: DateTime.fromJSDate(new Date(endDate)).toISO(),
      last_updated: DateTime.now().toISO(),
    },
  })

  if (data)
    return {
      status: "success",
      message: "Задача добавлена успешно",
    }

  return {
    status: "error",
    message: "Неизвестная ошибка",
  }
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
    last_updated_fmt: DateTime.fromJSDate(task.last_updated)
      .setLocale("ru")
      .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS),
    end_date_fmt: DateTime.fromJSDate(task.end_date)
      .setLocale("ru")
      .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS),
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
      message: "Одно из полей пустое",
    }

  const data = await prisma.task.update({
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
      last_updated: DateTime.now().toISO(),
    },
  })
  if (data)
    return {
      status: "success",
      message: "Задача успешно была изменена",
    }
}

export async function updateTaskStatus(id: string, status: string) {
  if (!(id && status))
    return {
      status: "error",
      message: "Одно из полей пустое",
    }

  const data = await prisma.task.update({
    where: {
      id: parseInt(id),
    },
    data: {
      status: status,
    },
  })
  if (data)
    return {
      status: "success",
      message: "Статус изменен успешно",
    }
}

export async function deleteTask(id: string) {
  if (!id)
    return {
      status: "error",
      message: "No ID",
    }

  const data = await prisma.task.delete({
    where: {
      id: parseInt(id),
    },
  })
  if (data)
    return {
      status: "success",
      message: "Удаление успешно",
    }
  return {
    status: "error",
    message: "Ошибка во время удаления",
  }
}
