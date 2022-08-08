export type TaskData = {
  id: number
  title: string
  description: string
  status: string
  start_date: string
  end_date: string
  last_updated: string
  priority: number
  author: number
  assigned_user: {
    id: number
    first_name: string
    second_name: string
    login: string
  }
}

export type DBUser = {
  first_name: string
  second_name: string
  login: string
  id: number
}
