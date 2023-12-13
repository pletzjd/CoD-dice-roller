const Sequelize = require('sequelize');
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
      dialectOptions: {
        ssl: {
            rejectUnauthorized: true,        
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
