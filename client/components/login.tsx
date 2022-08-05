export default function Login() {
  async function logIn(credentials: { login: string; password: string }) {
    console.log(credentials)
  }

  async function handleFormSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      login: { value: string }
      password: { value: string }
    }
    await logIn({ login: target.login.value, password: target.password.value })
  }

  return (
    <section className="h-screen">
      <div className="px-6 h-full text-gray-800">
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

              <div className="text-center">
                <button type="submit" className="btn">
                  Вход
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
