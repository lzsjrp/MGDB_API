import express from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import apiRoutes from './api/index.js'

app.use('/api', apiRoutes)

export default app

if (process.env.NODE_ENV !== 'development') {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}
