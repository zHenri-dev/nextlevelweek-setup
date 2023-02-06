import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'

const app = fastify()

app.register(cors, {
  origin: process.env.CORS_ORIGIN,
})
app.register(appRoutes)

const port = Number(process.env.PORT) || 3333

app
  .listen({
    host: '0.0.0.0',
    port,
  })
  .then(() => console.log(`HTTP Server running on port ${port}`))
