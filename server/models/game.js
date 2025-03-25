'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Game.hasMany(models.Wishlist, { foreignKey: 'gameId' })
    }
  }
  Game.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    platform1: DataTypes.STRING,
    platform2: DataTypes.STRING,
    platform3: DataTypes.STRING,
    genre1: DataTypes.STRING,
    genre2: DataTypes.STRING,
    genre3: DataTypes.STRING,
    developer1: DataTypes.STRING,
    developer2: DataTypes.STRING,
    developer3: DataTypes.STRING,
    publisher1: DataTypes.STRING,
    publisher2: DataTypes.STRING,
    publisher3: DataTypes.STRING,
    releaseDate: DataTypes.DATE,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};