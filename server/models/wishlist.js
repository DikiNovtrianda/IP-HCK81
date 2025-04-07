'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wishlist.belongsTo(models.User, { foreignKey: 'userId' })
      Wishlist.belongsTo(models.Game, { foreignKey: 'gameId' })
    }
  }
  Wishlist.init({
    userId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    isComment: DataTypes.BOOLEAN,
    comment: DataTypes.TEXT,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Wishlist',
  });
  return Wishlist;
};