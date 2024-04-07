import express from 'express'
import { router as noNameRouter } from './noname-router.js'

export const router = express.Router()

router.use('/', noNameRouter)
