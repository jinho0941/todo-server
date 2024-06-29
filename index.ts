import express from 'express'
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'
import cors from 'cors'

const prisma = new PrismaClient()
const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}
app.use(cors(corsOptions))

app.use(bodyParser.json())

app.post('/todos', async (req, res) => {
  const { title, description } = req.body
  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
      },
    })
    res.status(201).json(todo)
  } catch (error) {
    res.status(500).json({ error: 'Todo 생성 중 에러가 발생하였습니다.' })
  }
})

app.get('/todos', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    res.status(200).json(todos)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Todos를 가져오는 중 에러가 발생하였습니다.' })
  }
})

app.get('/todos/:id', async (req, res) => {
  const { id } = req.params
  try {
    const todo = await prisma.todo.findUnique({
      where: { id },
    })
    if (!todo) {
      return res.status(404).json({ error: 'Todo를 찾을 수 없습니다.' })
    }
    res.status(200).json(todo)
  } catch (error) {
    res.status(500).json({ error: 'Todo를 가져오는 중 에러가 발생하였습니다.' })
  }
})

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params
  const { title, description, completed } = req.body
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        description,
        completed,
      },
    })
    res.status(200).json(todo)
  } catch (error) {
    res.status(500).json({ error: 'Todo 업데이트 중 에러가 발생하였습니다.' })
  }
})

app.patch('/todos/:id/title', async (req, res) => {
  const { id } = req.params
  const { title } = req.body
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: {
        title,
      },
    })
    res.status(200).json(todo)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Todo 제목 업데이트 중 에러가 발생하였습니다.' })
  }
})

app.patch('/todos/:id/description', async (req, res) => {
  const { id } = req.params
  const { description } = req.body
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: {
        description,
      },
    })
    res.status(200).json(todo)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Todo 설명 업데이트 중 에러가 발생하였습니다.' })
  }
})

app.patch('/todos/:id/completed', async (req, res) => {
  const { id } = req.params
  const { completed } = req.body
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: {
        completed,
      },
    })
    res.status(200).json(todo)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Todo 완료 상태 업데이트 중 에러가 발생하였습니다.' })
  }
})

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params
  try {
    await prisma.todo.delete({
      where: { id },
    })
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: 'Todo 삭제 중 에러가 발생하였습니다.' })
  }
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
