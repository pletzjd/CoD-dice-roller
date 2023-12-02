const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Roll extends Model {}

Roll.init(
  {
    rollID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rollType: {
      type: DataTypes.STRING
    },
    playerName: {
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
    rollOne: {
        type: DataTypes.STRING
    },
    rollTwo: {
        type: DataTypes.STRING
    },
    rollOneSuccesses: {
        type: DataTypes.STRING
    },
    rollTwoSuccesses:{
        type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    updatedAt: false,
    freezeTableName: true,
    underscored: false,
    modelName: 'roll'
  }
);

module.exports = Roll;