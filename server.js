const express = require('express')
const sequelize = require('./config/connection');
const cron = require('node-cron');
const fs = require('fs')
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const rateLimit = require('express-rate-limit')

const app = express()
const routes = require('./routes')
const Port = process.env.PORT || 3001
const Host = process.env.HOST || 'localhost'

const limiter = rateLimit({
  windowMs: 1000,
  max: 6,
  message: 'To many requests from this IP. Please try again.'
})

app.use('/api/', limiter)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))
app.use(routes)


let currentMonth;
let cronMonth;

cron.schedule('*/15 * * * *', () => {
  currentMonth = (new Date).getMonth().toString()
  const url = `http://${Host}:${Port}/api/roll/deleteOld`
  fs.readFile('delete.txt','utf8',(error, data) =>{
    cronMonth = data
    if(cronMonth != currentMonth){
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
      }).then((response) => {
        fs.writeFile('delete.txt', currentMonth, (err) =>
        err ? console.error(err) : console.log('Success!'))
        cronMonth = currentMonth
        console.log('Performed cron')
      })
      .catch((err) => {console.log(err)})
    }else{
      console.log('cron job already performed this month')
    }
  })
})

sequelize.sync({ force: false }).then(() => {
    app.listen(Port, () => console.log(`Listening on http://localhost:${Port}`));
  });