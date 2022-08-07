import { useEffect, useState } from "react"

type User = {
  isLoggedIn: boolean
  id: number | null
  login: string | null
  role: string | null
}

export async function authenticate() {
  const responce = await fetch("/serverapi/authorization")
  const responceJson = await responce.json()
  return responceJson.user
}

export function useUser({ redirectTo = "", redirectIfFound = false } = {}) {
  const [user, mutateUser] = useState<User>({
    isLoggedIn: false,
    id: null,
    login: null,
    role: null,
  })

  useEffect(() => {
    async function getUser() {
      const fetchedUser = await authenticate()

      if (fetchedUser) mutateUser({ ...fetchedUser, isLoggedIn: true })
    }
    getUser()
  }, [])

  useEffect(() => {
    console.log(`usr`, user)

    // // if no redirect needed, just return (example: already on /dashboard)
    // // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    // if (!redirectTo || !user) return

    // if (
    //   // If redirectTo is set, redirect if the user was not found.
    //   (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
    //   // If redirectIfFound is also set, redirect if the user was found
    //   (redirectIfFound && user?.isLoggedIn)
    // ) {
    //   Router.push(redirectTo)
    // }
  }, [user])

  return { user, mutateUser }
}
