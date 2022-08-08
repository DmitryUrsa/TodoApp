import { useState } from "react"
import { useUser, authenticate } from "../hooks/useUser"

const users = [
  {
    first_name: "Dmitry",
    second_name: "Ursa",
    login: "DmitryUrsa",
    password: "123",
    role: "admin",
  },
  {
    first_name: "Bob",
    second_name: "Dylan",
    login: "bobtherobot200",
    password: "anothercoolpass!",
    role: "user",
  },
  {
    first_name: "Андрей",
    second_name: "Андрей",
    login: "aA200@mail.ru",
    password: "PassWord10",
    role: "user",
  },
  {
    first_name: "Denzel",
    second_name: "Curry",
    login: "Ultimate",
    password: "Bloons1",
    role: "user",
  },
]

export default function Login({ mutateUser }: any) {
  const [Message, setMessage] = useState<string | undefined>()

  async function logIn(credentials: { login: string; password: string }) {
    const responce = await fetch("/serverapi/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: credentials.login,
        password: credentials.password,
      }),
    })
    const content = (await responce.json()) as
      | { status: string; message: string }
      | undefined
    console.log(content)

    return content
  }

  async function handleFormSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      login: { value: string }
      password: { value: string }
    }
    const loginResponce = await logIn({
      login: target.login.value,
      password: target.password.value,
    })
    if (loginResponce?.status !== "success") setMessage(loginResponce?.message)
    if (loginResponce?.status === "success") {
      setMessage(undefined)
      const auth = await authenticate()

      mutateUser({ ...auth, isLoggedIn: true })
    }
  }

  return (
    <section className="h-screen">
      <div className="px-6 h-full">
        <div className="flex justify-center items-center flex-wrap h-full g-6">
          <div className="w-5/12 p-6 bg-base-200 rounded drop-shadow-xl">
            <form onSubmit={handleFormSubmit}>
              <h1 className="text-xl text-neutral-content font-bold mb-2">
                Войти
              </h1>
              <div className="form-control w-full mb-6">
                <label className="label">
                  <span className="label-text">Логин</span>
                </label>
                <input
                  type="text"
                  placeholder="Введите логин"
                  className="input input-bordered w-full"
                  name="login"
                />
              </div>
              <div className="form-control w-full mb-6">
                <label className="label">
                  <span className="label-text">Пароль</span>
                </label>
                <input
                  type="password"
                  placeholder="Введите пароль"
                  className="input input-bordered w-full"
                  name="password"
                />
              </div>
              {Message ? (
                <div className="alert alert-warning shadow-lg mb-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>{Message}</span>
                  </div>
                </div>
              ) : null}
              <div className="text-center">
                <button type="submit" className="btn">
                  Вход
                </button>
              </div>
            </form>

            <div className="mt-6">
              <h3>Логин : Пароль : Роль</h3>
              {users.map((user) => {
                return (
                  <div key={user.login}>
                    <b>{user.login}</b>|<b>{user.password}</b>|
                    <b>{user.role}</b>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
