import fs from 'fs'
import path from 'path'

export const routes = app => {
  // API routes

  fs.readdirSync(__dirname + '/routers/').forEach(file => {
    require(`./routers/${file.substr(0, file.indexOf('.'))}`)(app)
  })
}

export default routes
