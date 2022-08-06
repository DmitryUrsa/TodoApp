import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { logIn } from "./auth/user.js"

const app = express()

app.use(cors())

app.post("/login", bodyParser.json(), async (req, res) => {
  console.log("POST")
  const ParsedBody = req.body as {
    login: string
    password: string
  }

  const LoginResult = await logIn({
    login: ParsedBody.login,
    password: ParsedBody.password,
  })
  res.send(LoginResult)
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`API listening on ${port}`)
})
