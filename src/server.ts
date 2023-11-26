import mongoose from 'mongoose'
import app from './app'

import config from './config/index'

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string)
    app.listen(config.port, () => {
      console.log(`🛢 Database is connected & listening on port ${config.port}`)
    })
  } catch (err) {
    console.error('Failed to connect database', err)
  }
}

bootstrap()
