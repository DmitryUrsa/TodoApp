import type { NextPage } from "next"
import Header from "../components/header"
import Login from "../components/login"
import { useUser } from "../hooks/useUser"
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker"
import { useState, useEffect, SetStateAction } from "react"
import "react-datepicker/dist/react-datepicker.css"
import ru from "date-fns/locale/ru"
import { Button, Modal } from "react-daisyui"
import { User } from "@prisma/client"
registerLocale("ru", ru)

function InputField({
  label = "",
  placeholder = "",
  name = "",
  type = "input",
}) {
  return (
    <div className="form-control w-full mb-6">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      {type == "input" ? (
        <input
          type="text"
          placeholder={placeholder}
          className="input input-bordered w-full"
          name={name}
        />
      ) : null}
      {type == "textarea" ? (
        <textarea
          placeholder={placeholder}
          className="textarea textarea-bordered w-full"
          name={name}
        />
      ) : null}
    </div>
  )
}

type DBUser = {
  first_name: string
  second_name: string
  login: string
  id: number
}

function TaskItem({ task }: any) {
  const [visible, setVisible] = useState<boolean>(false)

  const toggleVisible = () => {
    setVisible(!visible)
  }

  let priorityClass = ""
  if (task.priority == 1) priorityClass = "bg-red-200 text-red-700"
  if (task.priority == 2) priorityClass = "bg-orange-200 text-orange-700"
  if (task.priority == 3) priorityClass = "bg-cyan-200 text-cyan-700"

  return (
    <>
      <li
        className="mb-4 bg-base-100 hover:bg-base-300 rounded p-4 cursor-pointer"
        onClick={toggleVisible}
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
        <p className="text-xs">
          Дата окончания: <b className="text-red-500">{task.end_date}</b>
        </p>
      </li>
      <Modal open={visible}>
        <Modal.Header className="font-bold mb-4">{task.title}</Modal.Header>

        <Modal.Body>
          <p>
            Назначенный: {task.assigned_user.first_name}{" "}
            {task.assigned_user.second_name}
          </p>
          <p>{task.description}</p>
          <p className="text-xs">
            Дата окончания: <b className="text-red-500">{task.end_date}</b>
          </p>
          <p className="text-xs">
            созданно: {task.start_date} / обновлено: {task.last_updated}
          </p>
        </Modal.Body>

        <Modal.Actions>
          <Button onClick={toggleVisible}>Yay!</Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}
function TasksList({
  tasks,
  groupBy = "lastUpdated",
  userID,
}: {
  tasks: any[]
  groupBy: string
  userID: number | null
}) {
  if (groupBy == "assignedUser") {
    const users = tasks.map((task) => ({
      id: task.assigned_user.id,
      name: `${task.assigned_user.first_name} ${task.assigned_user.second_name}`,
    }))
    const uniqueUsers = [
      ...new Map(users.map((item) => [item["id"], item])).values(),
    ]
    return uniqueUsers.map((user) => {
      return (
        <div className="mb-4" key={`user-tasks-${user.id}`}>
          <h3 className="font-bold">Задачи для {user.name}</h3>
          <ul>
            {tasks
              .filter((task) => task.assigned_user.id == user.id)
              .sort((a, b) => (a.priority > b.priority ? 1 : -1))
              .map((task) => {
                return <TaskItem key={`task-${task.id}`} task={task} />
              })}
          </ul>
        </div>
      )
    })
  }

  if (groupBy == "user" && userID) {
    return (
      <ul>
        {tasks
          .filter((task) => task.assigned_user.id == userID)
          .sort((a, b) => (a.end_date > b.end_date ? 1 : -1))
          .map((task) => {
            return <TaskItem key={`task-${task.id}`} task={task} />
          })}
      </ul>
    )
  }

  if (groupBy == "lastUpdated") {
    return (
      <ul>
        {tasks.map((task) => {
          return <TaskItem key={`task-${task.id}`} task={task} />
        })}
      </ul>
    )
  }

  return null
}

async function fetchTasks() {
  const responce = await fetch("/serverapi/gettasks")
  const tasks = await responce.json()
  return tasks
}

function TaskForm({ updateTasks, user }: { updateTasks: any; user: any }) {
  const [endDate, setEndDate] = useState(new Date())
  const [usersList, setUsersList] = useState<DBUser[] | []>([])
  useEffect(() => {
    async function getUsers() {
      const responce = await fetch("/serverapi/usersList")
      const usersList = await responce.json()

      setUsersList(usersList)
    }

    getUsers()
  }, [])

  async function handleTaskCreate(event: React.SyntheticEvent) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      header: { value: string }
      description: { value: string }
      priority: { value: string }
      assignedUser: { value: string }
      endDate: { value: string }
    }
    const responce = await fetch("/serverapi/createtask", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        header: target.header.value,
        description: target.description.value,
        priority: target.priority.value,
        assignedUser: target.assignedUser.value,
        endDate: endDate,
        author: user.id,
      }),
    })
    const content = (await responce.json()) as
      | { status: string; message: string }
      | undefined
    console.log(content)

    updateTasks()
  }

  return (
    <div className="w-1/2 p-6 bg-base-200 rounded drop-shadow-xl mx-auto">
      <form onSubmit={handleTaskCreate}>
        <h1 className="text-xl text-neutral-content font-bold mb-2">
          Создать задачу
        </h1>

        <InputField label="Заголовок" name="header" />
        <InputField label="Описание" name="description" type="textarea" />

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Дата окончания</span>
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            showTimeSelect
            locale="ru"
            timeCaption="Время"
            className="input input-bordered w-full"
            dateFormat="d MMMM, yyyy h:mm"
          />
        </div>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Приоритет</span>
          </label>
          <select name="priority" className="select w-full">
            <option disabled selected value={0}>
              Выберите приоритет задачи
            </option>
            <option value={1}>Высокий</option>
            <option value={2}>Средний</option>
            <option value={3}>Низкий</option>
          </select>
        </div>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Ответственный</span>
          </label>
          <select name="assignedUser" className="select w-full">
            <option disabled selected value={0}>
              Выберите ответственного
            </option>
            {usersList.map((user) => (
              <option
                value={user.id}
                key={user.id}
              >{`${user.first_name} ${user.second_name}`}</option>
            ))}
          </select>
        </div>

        <div className="text-center">
          <button type="submit" className="btn">
            Вход
          </button>
        </div>
      </form>
    </div>
  )
}

const Home: NextPage = () => {
  const { user, mutateUser } = useUser()
  const [tasksList, setTasksList] = useState([])
  const [tasksListSortType, setTasksListSortType] = useState("user")

  async function updateTasks() {
    setTasksList(await fetchTasks())
  }

  useEffect(() => {
    updateTasks()
  }, [])

  console.log(`user changed`, user)
  if (!user.isLoggedIn) return <Login mutateUser={mutateUser} />

  return (
    <div>
      <Header mutateUser={mutateUser} />
      <div className="w-1/2 p-6 bg-base-200 rounded drop-shadow-xl mx-auto">
        <div className="tabs mb-4">
          <a
            className={`tab tab-bordered ${
              tasksListSortType == "user" && "tab-active"
            }`}
            onClick={() => setTasksListSortType("user")}
          >
            Ваши задачи
          </a>
          <a
            className={`tab tab-bordered ${
              tasksListSortType == "assignedUser" && "tab-active"
            }`}
            onClick={() => setTasksListSortType("assignedUser")}
          >
            По ответственным
          </a>
          <a
            className={`tab tab-bordered ${
              tasksListSortType == "lastUpdated" && "tab-active"
            }`}
            onClick={() => setTasksListSortType("lastUpdated")}
          >
            Без группировок
          </a>
        </div>
        <TasksList
          tasks={tasksList}
          groupBy={tasksListSortType}
          userID={user.id}
        />
      </div>
      <TaskForm updateTasks={updateTasks} user={user} />
    </div>
  )
}

export default Home
