import { Alert } from "react-daisyui"
import { LoginUser } from "../hooks/useUser.js"

export function TaskItem({ task, editTask }: any) {
  let priorityClass = ""
  if (task.priority == 1) priorityClass = "bg-red-200 text-red-700"
  if (task.priority == 2) priorityClass = "bg-orange-200 text-orange-700"
  if (task.priority == 3) priorityClass = "bg-cyan-200 text-cyan-700"

  return (
    <li
      className="mb-4 bg-base-100 hover:bg-base-300 rounded p-4 cursor-pointer"
      onClick={() => editTask(task)}
    >
      {/* <p className="mb-2">
          {task.assigned_user.first_name} {task.assigned_user.second_name}
        </p> */}
      <h4 className="mb-2">{task.title}</h4>
      <div
        className={`mb-2 text-xs inline-flex items-center uppercase px-3 py-1 rounded-full ${priorityClass}`}
      >
        Приоритет {task.priority}
      </div>
      <p className="text-xs mb-1">
        Дата окончания: <b className="text-red-500">{task.end_date_fmt}</b>
      </p>
      <p className="text-[9px]">
        Последнее обновление: {task.last_updated_fmt}
      </p>
    </li>
  )
}
export function TasksList({
  tasks,
  groupBy = "lastUpdated",
  userID,
  editTask = null,
  user,
}: {
  tasks: any[]
  groupBy: string
  userID: number | null
  editTask: any
  user: LoginUser
}) {
  if (!tasks.length) return <Alert>Список задач пуст</Alert>

  if (groupBy == "assignedUser") {
    const users = tasks.map((task) => ({
      id: task.assigned_user.id,
      name: `${task.assigned_user.first_name} ${task.assigned_user.second_name}`,
    }))
    const uniqueUsers = [
      ...new Map(users.map((item) => [item["id"], item])).values(),
    ]
    const filteredTasks = tasks.filter(
      (task) => task.assigned_user.id == user.id
    )
    if (!filteredTasks.length) return <Alert>Список задач пуст</Alert>
    return (
      <>
        {uniqueUsers.map((user) => (
          <div
            className="mb-4 border-b-2 border-gray-600"
            key={`user-tasks-${user.id}`}
          >
            <h3 className="font-bold mb-2">Задачи для {user.name}</h3>
            <ul>
              {filteredTasks
                .sort((a, b) => (a.priority > b.priority ? 1 : -1))
                .map((task) => {
                  return (
                    <TaskItem
                      key={`task-${task.id}`}
                      task={task}
                      editTask={editTask}
                    />
                  )
                })}
            </ul>
          </div>
        ))}
      </>
    )
  }

  if (groupBy == "user" && userID) {
    const filteredTasks = tasks.filter(
      (task) => task.assigned_user.id == userID
    )
    if (!filteredTasks.length) return <Alert>Список задач пуст</Alert>
    return (
      <ul>
        {filteredTasks
          .sort((a, b) => (a.end_date > b.end_date ? 1 : -1))
          .map((task) => {
            return (
              <TaskItem
                key={`task-${task.id}`}
                task={task}
                editTask={editTask}
              />
            )
          })}
      </ul>
    )
  }

  if (groupBy == "lastUpdated") {
    return (
      <ul>
        {tasks
          .sort((a, b) => (a.last_updated < b.last_updated ? 1 : -1))
          .map((task) => {
            return (
              <TaskItem
                key={`task-${task.id}`}
                task={task}
                editTask={editTask}
              />
            )
          })}
      </ul>
    )
  }

  return null
}
