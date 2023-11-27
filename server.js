const express = require('express')
const sequelize = require('./config/connection');
const app = express()
const routes = require('./routes')
const Port = process.env.PORT || 3001

app.use(express.static('public'))

app.get('/', (req,res) => res.send('Homepage'))

sequelize.sync({ force: true }).then(() => {
    app.listen(Port, () => console.log(`Listening on http://localhost:${Port}`));
  });