'use strict';

const axios = require('axios');
require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const key = process.env.GIANTBOMB_API_KEY;
    console.log('Calling GUID list...\nhttps://www.giantbomb.com/api/games/?api_key=' + key + '&format=json&offset=40000');
    const response = await axios.get('https://www.giantbomb.com/api/games/?api_key=' + key + '&format=json&offset=40000');
    let guidList = response.data.results.map(game => game.guid);
    let gameData = await Promise.all(guidList.map(async (guid) => {
      console.log(`taking data from ${guid}...`);
      const itemResponse = await axios.get(`https://www.giantbomb.com/api/game/${guid}/?api_key=` + key + '&format=json');
      let description = itemResponse.data.results.description ? itemResponse.data.results.description.replace(/<\/?[^>]+(>|$)/g, "") : 'No description available';
      return {
        name: itemResponse.data.results.name,
        description: description,
        image: itemResponse.data.results.image.original_url,
        platform1: itemResponse.data.results.platforms && itemResponse.data.results.platforms.length > 0 ? itemResponse.data.results.platforms[0].name : 'null',
        platform2: itemResponse.data.results.platforms && itemResponse.data.results.platforms.length > 1 ? itemResponse.data.results.platforms[1].name : 'null',
        platform3: itemResponse.data.results.platforms && itemResponse.data.results.platforms.length > 2 ? itemResponse.data.results.platforms[2].name : 'null',
        genre1: itemResponse.data.results.genres && itemResponse.data.results.genres.length > 0 ? itemResponse.data.results.genres[0].name : 'null',
        genre2: itemResponse.data.results.genres && itemResponse.data.results.genres.length > 1 ? itemResponse.data.results.genres[1].name : 'null',
        genre3: itemResponse.data.results.genres && itemResponse.data.results.genres.length > 2 ? itemResponse.data.results.genres[2].name : 'null',
        developer1: itemResponse.data.results.developers && itemResponse.data.results.developers.length > 0 ? itemResponse.data.results.developers[0].name : 'null',
        developer2: itemResponse.data.results.developers && itemResponse.data.results.developers.length > 1 ? itemResponse.data.results.developers[1].name : 'null',
        developer3: itemResponse.data.results.developers && itemResponse.data.results.developers.length > 2 ? itemResponse.data.results.developers[2].name : 'null',
        publisher1: itemResponse.data.results.publishers && itemResponse.data.results.publishers.length > 0 ? itemResponse.data.results.publishers[0].name : 'null',
        publisher2: itemResponse.data.results.publishers && itemResponse.data.results.publishers.length > 1 ? itemResponse.data.results.publishers[1].name : 'null',
        publisher3: itemResponse.data.results.publishers && itemResponse.data.results.publishers.length > 2 ? itemResponse.data.results.publishers[2].name : 'null',
        releaseDate: itemResponse.data.results.original_release_date,
        price: Math.floor(Math.random() * 500) * 2000,
        updatedAt: new Date(),
        createdAt: new Date()
      };
    }));
    console.log('Inserting game data...');
    await queryInterface.bulkInsert('Games', gameData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Games', null, {});
  }
};
