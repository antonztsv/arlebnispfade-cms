import express from 'express'
import { connectToDatabase } from '@/db/database'

import exampleRoutes from '@/routes/exampleRoutes'
import authRoutes from '@/routes/authRoutes'

import { authMiddleware, roleMiddleware } from '@/middleware/auth'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

const apiRouter = express.Router()

// Public routes
// apiRouter.use('/', exampleRoutes)

// Auth routes
apiRouter.use('/auth', authRoutes)

// Protected routes
apiRouter.use('/', authMiddleware, exampleRoutes)
apiRouter.use('/admin', roleMiddleware(['admin']))

app.use('/api', apiRouter)

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error)
    process.exit(1)
  })

export default app
