import { Request, Response } from "express";
import {PrismaClient} from "@prisma/client"
import * as z from "zod"

interface data_create{
   full_name: string,
   email: string,
   password_hash: string,
   user_type:string
}

const create_validation = z.object({
    full_name: z.string().min(2),
    email: z.string().email("email invalido"),
    password_hash: z.string().min(1, "Senha senha invalida"),
    user_type:z.string().min(1, "tipo de usuario invalido")
})

const get_validation = z.object({
    id: z.string(),
})

export class UserController {
    private user_prisma: PrismaClient
  
    constructor(){
        this.user_prisma = new PrismaClient()
    }

    public index = async (req: Request, res:Response) => {
        const users = await this.user_prisma.user.findMany()
        return (res.json(users))
    }

    public create =  async (req: Request, res:Response) => {
        try{
            const {full_name,email, password_hash,user_type} = create_validation.parse(req.body)
            const users = await this.user_prisma.user.findFirst({where: {email: email}})
            if(users)
                return res.status(409).json({message:"Email ja esta em uso", isOk:false})
            const newUser = await this.user_prisma.user.create({data:{full_name: full_name, email:email, password_hash: password_hash, user_type:user_type}}) 
            return res.status(201).json({ data:newUser,  message:"Usuario criado com sucesso", isOk:true})
        }catch(error)
        {
            if(error instanceof z.ZodError)
                return (res.status(400).json({"error":"Bad Request", "message": " A solicitação do cliente contém dados inválidos ou malformados", isOk:false,}))
            return (res.status(500).json({"error":"Internal Server Error", "message": " Problemas ao salvar o usuário no banco de dados devido a erros inesperados ou falhas de configuração.", isOk:false}))
        }
    }

    public delete =  async (req: Request, res:Response) =>{
        try{   
            const {id} = get_validation.parse(req.params)
            
            const user = await this.user_prisma.user.delete({where: {id: Number(id)}})
            if (user)
                return (res.json({message:"Usuario apagado com sucesso", isOk: true}))
            else
                return (res.status(404).json({message:"Usuario Nâo encontrado", isOk: false}))
        }catch(error)
        {
          
            if (error instanceof z.ZodError)
                return (res.status(400).json({"error":"Bad Request", "message": " A solicitação do cliente contém dados inválidos ou malformados", isOk:"false"}))
            return (res.status(500).json({"error":"Internal Server Error", "message": " Problemas ao salvar o usuário no banco de dados devido a erros inesperados ou falhas de configuração.", isOk:false}))
        }
    }

    public findOne = async (req: Request, res:Response) => {
        try{   
            const {id} = get_validation.parse(req.params)
        
            const user = await this.user_prisma.user.findUnique({where: {id: Number(id)}})
            if (user)
                return (res.json(user))
            else
                return (res.status(404).json({message:"Usuario Nâo encontrado"}))
        }catch(error)
        {
            console.log(error)
            if (error instanceof z.ZodError)
                return (res.status(400).json({"error":"Bad Request", "message": " A solicitação do cliente contém dados inválidos ou malformados", isOk:"false"}))
            return (res.status(500).json({"error":"Internal Server Error", "message": " Problemas ao salvar o usuário no banco de dados devido a erros inesperados ou falhas de configuração.", isOk:false}))
        }
      
    }

    
}