import express from 'express'

import { NonameController } from '../../../controllers/noname-controller.js'

export const router = express.Router()

const controller = new NonameController()

router.get('/', async (req, res) => {
    res.json({ message: "Hello, World!" });
  });
