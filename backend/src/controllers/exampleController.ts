import { RequestHandler } from 'express'

export const getExample: RequestHandler = async (req, res, next) => {
  try {
    // Simulating data retrieval
    const exampleData = {
      id: 1,
      name: 'Example Item',
      description: 'This is an example item'
    }
    res.json(exampleData)
  } catch (error) {
    next(error)
  }
}

export const createExample: RequestHandler = async (req, res, next) => {
  try {
    // Simulating data creation
    const newItem = {
      id: Date.now(), // Generate a simple ID
      ...req.body
    }
    res.status(201).json(newItem)
  } catch (error) {
    next(error)
  }
}
