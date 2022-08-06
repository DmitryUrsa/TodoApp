import type { NextPage } from "next"
import Header from "../components/header"
import Login from "../components/login"
import { useUser } from "../hooks/useUser"

const Home: NextPage = () => {
  const { user, mutateUser } = useUser()
  console.log(`user changed`, user)
  if (!user.isLoggedIn) return <Login mutateUser={mutateUser} />

  return (
    <div>
      <Header mutateUser={mutateUser} />
    </div>
  )
}

export default Home
