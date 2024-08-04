import express, { NextFunction } from "express"
import cors from "cors";
import { UserController } from "./src/controllers/UserController"
import { AuthController } from "./src/controllers/AuthController";
import { tokenValidate } from "./src/utils";

const userController = new UserController()
const authController = new AuthController()
const app = express()

//middleware de configuracao
app.use(cors())
app.use(express.json())

//Rotas 
app.post("/login", authController.login)
app.post("/users", userController.create)

//Rotas protegidas
app.get("/users",tokenValidate, userController.index)
app.get("/users/:id", tokenValidate,userController.findOne)
app.delete("/users/:id",tokenValidate, userController.delete)
app.post("/logout",tokenValidate, authController.logout)

app.listen(3333, () => {
    console.log("server is running on 3333 port")
})