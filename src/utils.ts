import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";
import { NextFunction, Request, Response } from "express";
import  jwt  from "jsonwebtoken";
import { z } from "zod";

const prismaClient = new PrismaClient()
export {prismaClient}

export function generateHash(text: string): string {
    const hash = createHash("sha256");
  
    hash.update(text);
    const hashGerada: string = hash.digest("hex");
  
    return hashGerada;
}
export function tokenValidate(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization
    if (!token)
        return res.status(401).send({ error: "Token is required" })

    token = token.split(" ")[1]
    try {
        const decoder = jwt.verify(token, my_env.JWT_KEY)
        // req.id = (decoder as data).id
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send({ error: "Token is expired" })
        }
        return res.status(401).send({ error: "Token is invalid" })
    }
}
export const my_env = z.object({
    DATABASE_URL: z.string(),
    JWT_KEY: z.string()
}).parse(process.env)