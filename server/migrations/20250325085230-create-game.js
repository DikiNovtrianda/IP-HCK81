'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING
      },
      platform1: {
        type: Sequelize.STRING
      },
      platform2: {
        type: Sequelize.STRING
      },
      platform3: {
        type: Sequelize.STRING
      },
      genre1: {
        type: Sequelize.STRING
      },
      genre2: {
        type: Sequelize.STRING
      },
      genre3: {
        type: Sequelize.STRING
      },
      developer1: {
        type: Sequelize.STRING
      },
      developer2: {
        type: Sequelize.STRING
      },
      developer3: {
        type: Sequelize.STRING
      },
      publisher1: {
        type: Sequelize.STRING
      },
      publisher2: {
        type: Sequelize.STRING
      },
      publisher3: {
        type: Sequelize.STRING
      },
      releaseDate: {
        type: Sequelize.DATE
      },
      price: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Games');
  }
};