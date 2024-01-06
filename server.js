const express = require('express')
const sequelize = require('./config/connection');
const cron = require('node-cron');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
// const rateLimit = require('express-rate-limit')

const app = express()
const routes = require('./routes')
const Port = process.env.PORT || 3001
const Host = process.env.HOST || 'localhost'

// const limiter = rateLimit({
//   windowMs: 1000,
//   max: 6,
//   message: 'To many requests from this IP. Please try again.'
// })

// app.use('/api/', limiter)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))
app.use(routes)

cron.schedule('0 0 1 * *', () => {
  const url = `http://${Host}:${Port}/api/roll/deleteOld`
  fetch(url, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  }).then(function (response) {
    return response.json();
  }).catch((err) => { console.log(err) })
})

sequelize.sync({ force: false }).then(() => {
  app.listen(Port, () => console.log(`Listening on http://localhost:${Port}`));
});