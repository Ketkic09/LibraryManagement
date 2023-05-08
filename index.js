// start server using cmd : nodemon .\index.js
const connectToMongo = require('./database')
const express = require('express')
const app = express()
const port = 3000

//connecting to db
connectToMongo()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello ketki!')
  })
  
  app.listen(port, () => {
    console.log(`Ecom listening on port ${port}`)
  })

//registering routes
app.use('/api/auth',require('./routes/auth'))
//app.use('/api/newauth',require('./routes/newauth'))