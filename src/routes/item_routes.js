import { ItemModel } from "../db.js"
import { Router } from "express"


const router = Router()


router.get('/', async (req, res) => res.send(await ItemModel.find().populate("category")))

router.get('/:id', async (req, res) => {
    const entry = await ItemModel.findById(req.params.id).populate("category")
    if (entry) {
        res.send(entry)
    } else {
        res.status(404).send({ error: 'Entry not found' })
    }
})

router.post('/', async (req, res) => {
    try {
        const insertedEntry = await (await ItemModel.create(req.body)).populate('category')
        res.status(201).send(insertedEntry)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const updatedEntry = await ItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (updatedEntry) {
            res.send(updatedEntry)
        } else {
            res.status(404).send({ error: 'Entry not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedEntry = await ItemModel.findByIdAndDelete(req.params.id)
        if (deletedEntry) {
            res.sendStatus(204)
        } else {
            res.status(404).send({ error: 'Entry not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export default router 
