import { useUser } from "../hooks/useUser"

export default function Header({ mutateUser }: any) {
  const { user } = useUser()
  async function logout() {
    const responce = await fetch("/serverapi/logout")
    const responceJson = await responce.json()
    console.log(responceJson)

    mutateUser({
      isLoggedIn: false,
      login: null,
      role: null,
    })
  }
  return (
    <div className="mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center py-6">
        <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
          <div className="mr-4">
            {user.role}, {user.login}
          </div>
          <button onClick={logout} className="btn btn-primary">
            Выход
          </button>
        </div>
      </div>
    </div>
  )
}
