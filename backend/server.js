import 'dotenv/config'
import express from 'express'
import rateLimit from 'express-rate-limit'
import simulationGamesRoutes from './routes/simulation-games.js'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000


app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'https://scamspot.page',
    'https://version2.scamspot.page',
    'https://main.d3fekirfq4nkfc.amplifyapp.com',
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { error: "Too many requests, please try again later." }
})
app.use(limiter)

app.use(express.json())

// Health check endpoint (useful for load balancer)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.get('/', (req, res) => {
  res.send('Hello from Node.js!')
})

// Use the simulation games routes
app.use('/api/simulation-games', simulationGamesRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Listen on all interfaces for Elastic Beanstalk
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`)
})

