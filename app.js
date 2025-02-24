const express = require('express')
const sequelize = require('./config/connection');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit')
const {Op} = require("sequelize")

const Roll = require('./models/Roll.js');

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
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'))
})
app.use(routes)

//Delete rolls older than 2 months at the start of each month
cron.schedule('0 0 1 * *', () => {
  let currentDate = new Date;
  let twoMonthsAgo;
  if(currentDate.getMonth() <= 1){
      twoMonthsAgo = new Date(currentDate.getFullYear() - 1, 10 + currentDate.getMonth(), currentDate.getDate())
  }else{
      twoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, currentDate.getDate())
  }

  Roll.destroy({
      where: {
          createdAt: {
              [Op.lte]: twoMonthsAgo
          }
      }
  })
  .then((data) => {
      console.log(data)
  })
})

sequelize.sync({ force: false }).then(() => {
  app.listen(Port, () => console.log(`Listening on http://localhost:${Port}`));
});