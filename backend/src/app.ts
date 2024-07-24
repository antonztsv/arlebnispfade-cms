import express from 'express'
import exampleRoutes from '@/routes/exampleRoutes'
import { errorHandler } from '@/helpers/errorHandler'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// Routes
app.use('/api', exampleRoutes)

// Error handling middleware
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

export default app
