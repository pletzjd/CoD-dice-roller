const Sequelize = require('sequelize');
const fs = require('fs')
require('dotenv').config();

let sequelize;

if(process.env.DB_HOST){
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      port: process.env.DB_PORT,
      dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync('./config/ca.pem').toString(),        
        }
      }
    }
  );
}else{
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
    }
  );
}



module.exports = sequelize;
