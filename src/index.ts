import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { logIn, verifyToken } from "./auth/user.js"
import jwt from "jsonwebtoken"

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
  res.json(LoginResult)
})

app.get("/authorization", async (req, res, next) => {
  const token = req.get("x-access-token")

  const verifyResult = verifyToken(token)
  console.log(verifyResult)

  if (verifyResult.status === "error")
    res.status(401).json({
      status: verifyResult.status,
      message: verifyResult.message,
      user: null,
    })

  if (verifyResult.status === "success")
    res.json({
      status: verifyResult.status,
      message: "Авторизиривон успешно",
      user: verifyResult.user,
    })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`API listening on ${port}`)
})
