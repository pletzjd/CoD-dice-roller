const express = require('express')
const app = express()
const Port = 3001

app.use(express.static('public'))

app.get('/', (req,res) => res.send('Homepage'))

app.listen(Port, () => console.info(`Listening on https://localhost:${Port}`))