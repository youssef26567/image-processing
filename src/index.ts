/* eslint-disable prettier/prettier */
import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import router from './routes/main'

dotenv.config()

const PORT = process.env.PORT || 3000
// create an instance server
const app: Application = express()
// HTTP request logger middleware
app.use(morgan('short'))

// add routing for / path
app.get('/', (req: Request, res: Response) => {
  res.send('server is connected')
})
app.use('/', router)
// start express server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is starting at port:${PORT}`)
})

// eslint-disable-next-line prettier/prettier
export default app
