import { LoginUser } from "../hooks/useUser"
import { DBUser, TaskData } from "./Tyoes"
import { useState, useEffect } from "react"
import { Input, Textarea, Select, Button } from "react-daisyui"
import FormAlerts from "./FormAlerts"

import "react-datepicker/dist/react-datepicker.css"
import ru from "date-fns/locale/ru"
import DatePicker, { registerLocale } from "react-datepicker"
registerLocale("ru", ru)

export default function EditTaskForm({
  currentTaskDataFill,
  user,
  usersList,
  updateTasks,
  flushTaskData,
}: {
  currentTaskDataFill: TaskData
  user: LoginUser
  usersList: DBUser[]
  updateTasks: Function
  flushTaskData: Function
}) {
  const [descriptionField, setDescriptionField] = useState<string>("")
  const [headerField, setHeaderField] = useState<string>("")
  const [endDate, setEndDate] = useState<Date>()
  const [currentTaskData, setCurrentTaskData] = useState<TaskData | undefined>()
  const [resultMessage, setResultMessage] = useState<
    | {
        message: string
        status: any
      }
    | undefined
  >()

  useEffect(() => {
    if (currentTaskDataFill) {
      setCurrentTaskData(currentTaskDataFill)
      setEndDate(
        currentTaskDataFill.end_date
          ? new Date(currentTaskDataFill.end_date)
          : new Date()
      )
      setHeaderField(currentTaskDataFill.title)
      setDescriptionField(currentTaskDataFill.description)
    }
  }, [currentTaskDataFill])

  async function handleTaskUpdate(event: React.SyntheticEvent) {
    event.preventDefault()
    if (!currentTaskData?.id) return

    const target = event.target as typeof event.target & {
      header: { value: string }
      description: { value: string }
      priority: { value: string }
      assignedUser: { value: string }
      endDate: { value: string }
      status: { value: string }
    }
    const preparedBody = {
      header: headerField,
      description: descriptionField,
      priority: target.priority.value,
      assignedUser: target.assignedUser.value,
      endDate: endDate,
      author: user.id,
      status: target.status.value,
    }

    const responce = await fetch(
      `/serverapi/updatetask/${currentTaskData.id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedBody),
      }
    )
    const content = (await responce.json()) as
      | { status: string; message: string }
      | undefined
    console.log(`content`, content)

    if (content?.status == "error") {
      setResultMessage({ message: content.message, status: "error" })
    }
    if (content?.status == "success") {
      setResultMessage({ message: content.message, status: "success" })
      updateTasks()
    }
  }

  async function deleteTask(event: React.SyntheticEvent) {
    event.preventDefault()
    if (!currentTaskData?.id) return

    const responce = await fetch(
      `/serverapi/updatetask/${currentTaskData.id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    const content = (await responce.json()) as
      | { status: string; message: string }
      | undefined
    console.log(`content`, content)

    if (content?.status == "success") {
      flushTaskData()
      updateTasks()
    }
  }

  return (
    <div className="w-full p-6 mx-auto">
      <form onSubmit={handleTaskUpdate}>
        <h1 className="text-xl text-neutral-content font-bold mb-2">
          Редактировать задачу
        </h1>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Заголовок</span>
          </label>
          <Input
            disabled={user.role !== "admin"}
            name={`header`}
            value={headerField}
            onChange={(e) => setHeaderField(e.target.value)}
          />
        </div>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Описание</span>
          </label>
          <Textarea
            disabled={user.role !== "admin"}
            name={`description`}
            value={descriptionField}
            onChange={(e) => setDescriptionField(e.target.value)}
          />
        </div>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Дата окончания</span>
          </label>
          <DatePicker
            disabled={user.role !== "admin"}
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
            <span className="label-text">Статус</span>
          </label>
          <Select name="status">
            <option
              value={"pending"}
              selected={currentTaskData?.status == "pending" ? true : undefined}
            >
              Ожидает выполнения
            </option>
            <option
              value={"started"}
              selected={currentTaskData?.status == "started" ? true : undefined}
            >
              Выполняется
            </option>
            <option
              value={"finished"}
              selected={
                currentTaskData?.status == "finished" ? true : undefined
              }
            >
              Готово
            </option>
          </Select>
        </div>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Приоритет</span>
          </label>
          <Select name="priority" disabled={user.role !== "admin"}>
            <option
              value={1}
              selected={currentTaskData?.priority == 1 ? true : undefined}
            >
              Высокий
            </option>
            <option
              value={2}
              selected={currentTaskData?.priority == 2 ? true : undefined}
            >
              Средний
            </option>
            <option
              value={3}
              selected={currentTaskData?.priority == 3 ? true : undefined}
            >
              Низкий
            </option>
          </Select>
        </div>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Ответственный</span>
          </label>
          <Select name="assignedUser" disabled={user.role !== "admin"}>
            {usersList.map((user) => (
              <option
                value={user.id}
                key={user.id}
                selected={
                  currentTaskData?.assigned_user?.id == user.id
                    ? true
                    : undefined
                }
              >{`${user.first_name} ${user.second_name}`}</option>
            ))}
          </Select>
        </div>

        <div className="text-center">
          <Button type="submit">Отредактировать</Button>
          <Button onClick={deleteTask} className="btn-error ml-2">
            Удалить задачу
          </Button>
        </div>
        <FormAlerts resultMessage={resultMessage} />
      </form>
    </div>
  )
}
