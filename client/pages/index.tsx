import type { NextPage } from "next"
import Header from "../components/header"
import Login from "../components/login"
import { useUser } from "../hooks/useUser"
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker"
import { useState, useEffect } from "react"
import "react-datepicker/dist/react-datepicker.css"
import ru from "date-fns/locale/ru"
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
  first_name: "Dmitry"
  second_name: "Ursa"
  login: "DmitryUrsa"
  id: 6
}

const Home: NextPage = () => {
  const { user, mutateUser } = useUser()
  const [startDate, setStartDate] = useState(new Date())
  const [usersList, setUsersList] = useState<DBUser[] | []>([])
  useEffect(() => {
    async function getUsers() {
      const responce = await fetch("/serverapi/usersList")
      const usersList = await responce.json()
      console.log(usersList)

      setUsersList(usersList)
    }
    getUsers()
  }, [])

  function handleTaskCreate(event: React.SyntheticEvent) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      header: { value: string }
      description: { value: string }
      priority: { value: string }
      assignedUser: { value: string }
    }
    console.log(target.header.value)
  }

  console.log(`user changed`, user)
  if (!user.isLoggedIn) return <Login mutateUser={mutateUser} />

  return (
    <div>
      <Header mutateUser={mutateUser} />
      <div className="w-5/12 p-6 bg-base-200 rounded drop-shadow-xl">
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
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
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
              <option disabled selected>
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
              <option disabled selected>
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
    </div>
  )
}

export default Home
