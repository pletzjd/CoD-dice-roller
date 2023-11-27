const express = require('express')
const sequelize = require('./config/connection');
const app = express()
const routes = require('./routes')
const Port = process.env.PORT || 3001

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.get('/', (req,res) => res.send('Homepage'))
app.use(routes)

sequelize.sync({ force: false }).then(() => {
    app.listen(Port, () => console.log(`Listening on http://localhost:${Port}`));
  });