import { useState } from "react"
import { Input, Textarea, Select, Button } from "react-daisyui"
import { LoginUser } from "../hooks/useUser"
import FormAlerts from "./FormAlerts"
import { DBUser } from "./Tyoes"

import "react-datepicker/dist/react-datepicker.css"
import ru from "date-fns/locale/ru"
import DatePicker, { registerLocale } from "react-datepicker"
registerLocale("ru", ru)

export default function CreateTaskForm({
  user,
  usersList,
  updateTasks,
  flushTaskData,
}: {
  user: LoginUser
  usersList: DBUser[]
  updateTasks: Function
  flushTaskData: Function
}) {
  const [descriptionField, setDescriptionField] = useState<string>("")
  const [headerField, setHeaderField] = useState<string>("")
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [resultMessage, setResultMessage] = useState<
    | {
        message: string
        status: any
      }
    | undefined
  >()

  function resetForm() {
    setHeaderField("")
    setDescriptionField("")
  }

  async function handleTaskCreate(event: React.SyntheticEvent) {
    event.preventDefault()
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
      status: target.status.value,
      endDate: endDate,
      author: user.id,
    }
    console.log(preparedBody)

    const responce = await fetch("/serverapi/createtask", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preparedBody),
    })
    const content = (await responce.json()) as
      | { status: string; message: string }
      | undefined
    console.log(content)
    if (content?.status == "error") {
      setResultMessage({ message: content.message, status: "error" })
    }
    if (content?.status == "success") {
      flushTaskData()
      updateTasks()
      resetForm()
    }
  }

  return (
    <div className="w-full p-6 mx-auto">
      <form onSubmit={handleTaskCreate}>
        <h1 className="text-xl text-neutral-content font-bold mb-2">
          Редактировать задачу
        </h1>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Заголовок</span>
          </label>
          <Input
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
            <option value={"pending"}>Ожидает выполнения</option>
            <option value={"started"}>Выполняется</option>
            <option value={"finished"}>Готово</option>
          </Select>
        </div>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Приоритет</span>
          </label>
          <Select name="priority" disabled={user.role !== "admin"}>
            <option value={1}>Высокий</option>
            <option value={2}>Средний</option>
            <option value={3}>Низкий</option>
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
              >{`${user.first_name} ${user.second_name}`}</option>
            ))}
          </Select>
        </div>

        <div className="text-center">
          <Button type="submit">Создать задачу</Button>
        </div>
        <FormAlerts resultMessage={resultMessage} />
      </form>
    </div>
  )
}
