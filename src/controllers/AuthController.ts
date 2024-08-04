import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { z, ZodError } from "zod";
import { blackList, generateHash, my_env, prismaClient } from "../utils";
import  jwt ,{ verify } from "jsonwebtoken";
const login_validation = z.object({
    email: z.string().email(),
    password: z.string().min(1)
})


export class AuthController {
    constructor() {}

    public login = async (req: Request, res:Response) => {
        try {
            const {email, password} = login_validation.parse(req.body)
            const user = await prismaClient.user.findFirst({where:{email: email}})
            if (!user)
                return (res.status(401).json({message:"Senha ou email errado dcssfasfas", isOk:false}))
            const password_verify = generateHash(password)
            if (password_verify == user.password_hash)
            {
                const payload = {id: user.id, fullname: user.full_name}
                const token = jwt.sign(payload, my_env.JWT_KEY, {expiresIn: "1d"})
                return (res.status(200).json({ token: token,user:{full_name:user.full_name, email: user.email}, isOk:"true"}))
            }
            return (res.status(401).json({message:"Senha ou email errado1", isOk:false}))
        }catch(error)
        {
            console.log(error)
            if (error instanceof z.ZodError)
                return (res.status(400).json({"error":"Bad Request", "message": " A solicitação do cliente contém dados inválidos ou malformados", isOk:"false"}))
            return (res.status(500).json({"error":"Internal Server Error", "message": " Problemas ao salvar o usuário no banco de dados devido a erros inesperados ou falhas de configuração.", isOk:false}))
        }
    }

    public logout = async (req: Request, res:Response) => {
        try {
            let token = req.headers.authorization
            console.log("11111")
            blackList(String(token))
            console.log("safdbhsafiosgefiougeiuofgewiufg")
            return (res.status(200).json({}))
        }catch(error)
        {  console.log("2222222")
            return (res.status(500).json({"error":"Internal Server Error", "message": " Problemas ao salvar o usuário no banco de dados devido a erros inesperados ou falhas de configuração.", isOk:false}))
        }
    }

}