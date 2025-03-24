'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comment.init({
    userId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Rating is required'
        },
        notEmpty: {
          msg: 'Rating is required'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};