import type { NextPage } from "next"
import Header from "../components/header"
import Login from "../components/login"
import { useUser } from "../hooks/useUser"
import { useState, useEffect } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { Button, Modal } from "react-daisyui"
import EditTaskForm from "../components/EditTaskForm"
import CreateTaskForm from "../components/CreateTaskForm"
import { TasksList } from "../components/TaskList"

type DBUser = {
  first_name: string
  second_name: string
  login: string
  id: number
}

async function fetchTasks() {
  const responce = await fetch("/serverapi/gettasks")
  const tasks = await responce.json()
  return tasks
}

function TaskForm({
  updateTasks,
  user,
  currentTaskDataFill = null,
  flushTaskData,
}: {
  updateTasks: any
  user: any
  currentTaskDataFill?: any
  flushTaskData: any
}) {
  const [usersList, setUsersList] = useState<DBUser[] | []>([])

  useEffect(() => {
    async function getUsers() {
      const responce = await fetch("/serverapi/usersList")
      const usersList = await responce.json()

      setUsersList(usersList)
    }

    getUsers()
  }, [])

  if (currentTaskDataFill) {
    return (
      <EditTaskForm
        currentTaskDataFill={currentTaskDataFill}
        user={user}
        usersList={usersList}
        updateTasks={updateTasks}
        flushTaskData={flushTaskData}
      />
    )
  }

  if (user.role !== "admin") {
    return <div>Недостаточно прав на создание задачи</div>
  }

  return (
    <CreateTaskForm
      user={user}
      usersList={usersList}
      updateTasks={updateTasks}
      flushTaskData={flushTaskData}
    />
  )
}

const Home: NextPage = () => {
  const { user, mutateUser } = useUser()
  const [tasksList, setTasksList] = useState([])
  const [tasksListSortType, setTasksListSortType] = useState("user")
  const [editTaskData, setEditTaskData] = useState(null)
  const [visible, setVisible] = useState<boolean>(false)

  function toggleVisible() {
    setVisible(!visible)
  }

  function showAddTask() {
    flushTaskData()
    toggleVisible()
  }

  async function updateTasks() {
    setTasksList(await fetchTasks())
  }

  function editTask(task: any) {
    console.log("edit task!", task)
    setEditTaskData(task)
    toggleVisible()
  }

  function flushTaskData() {
    setEditTaskData(null)
    toggleVisible()
  }

  useEffect(() => {
    updateTasks()
  }, [])

  console.log(`user changed`, user)
  if (!user.isLoggedIn) return <Login mutateUser={mutateUser} />

  return (
    <>
      <div>
        <Header mutateUser={mutateUser} />
        <div className="w-full p-6 bg-base-200 rounded drop-shadow-xl mx-auto">
          {user.role === "admin" ? (
            <Button onClick={toggleVisible}>Создать задачу</Button>
          ) : null}

          <div className="tabs mb-4 mt-4">
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
              Все задачи
            </a>
          </div>
          <TasksList
            tasks={tasksList}
            groupBy={tasksListSortType}
            userID={user.id}
            editTask={editTask}
          />
        </div>
      </div>
      <Modal
        open={visible}
        onClickBackdrop={showAddTask}
        className="bg-base-300"
      >
        <Button
          size="sm"
          shape="circle"
          className="absolute right-2 top-2"
          onClick={showAddTask}
        >
          ✕
        </Button>

        <Modal.Body>
          <TaskForm
            updateTasks={updateTasks}
            user={user}
            currentTaskDataFill={editTaskData}
            flushTaskData={flushTaskData}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Home
