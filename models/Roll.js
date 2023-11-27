const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Roll extends Model {}

Roll.init(
  {
    roll_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roll_Type: {
      type: DataTypes.STRING
    },
    player_Name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    dice: {
        type: DataTypes.INTEGER
    },
    willpower: {
        type: DataTypes.BOOLEAN
    },
    again: {
        type: DataTypes.INTEGER
    },
    rote: {
        type: DataTypes.BOOLEAN
    },
    advanced: {
        type: DataTypes.BOOLEAN
    },
    roll_Results: {
        type: DataTypes.STRING
    },
    advanced_Reroll: {
        type: DataTypes.STRING
    },
    successes: {
        type: DataTypes.STRING
    },
    advanced_Successes:{
        type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    updatedAt: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'roll'
  }
);

module.exports = Roll;