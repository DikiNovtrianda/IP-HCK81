'use strict';
const {
  Model,
  Op
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



    static getPublicGames({ page, limit, search, sort, order, filter }) {
      let option = {
        where: {}
      }
      if (search) {
        option.where.name = {
          [Op.iLike]: `%${search}%`
        }
      }
      if (sort) {
        option.order = [[sort, order]]
      }
      if (filter) {
        option.where.genre1 = filter
      }
      option.limit = limit
      option.offset = !page ? 0 : limit * (page - 1)
      return this.findAndCountAll(option)
    }
  }
  Game.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
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