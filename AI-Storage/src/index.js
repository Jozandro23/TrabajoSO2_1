import './config/env.js'
import express from 'express'
import cors from 'cors'
// Seguridad: Añade encabezados HTTP que protegen contra algunas vulnerabilidades comunes
import helmet from 'helmet'
// Seguridad: Limita el número de solicitudes que puede hacer una IP para evitar abusos
import rateLimit from 'express-rate-limit'
import assistantRouter from './routes/assistant.route.js'
import eventsRouter from './routes/event.route.js'

const app = express()
const PORT = process.env.PORT || 3000

// Seguridad: Permite solicitudes controladas desde otros dominios, útil para prevenir problemas con CORS
app.use(cors())

// Seguridad: Aplica cabeceras HTTP seguras para reducir riesgos comunes (XSS, Clickjacking, etc.)
app.use(helmet())

// Seguridad: Limita a 100 solicitudes por IP cada 15 minutos para prevenir ataques de fuerza bruta o DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)


app.use(express.json())
app.use('/assistant', assistantRouter)
app.use('/events', eventsRouter)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found.' })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
