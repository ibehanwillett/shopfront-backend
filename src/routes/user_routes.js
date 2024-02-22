import { UserModel } from "../db.js"
import { Router } from "express"

const router = Router()


router.get('/', async (req, res) => res.send(await UserModel.find()))

export default router 