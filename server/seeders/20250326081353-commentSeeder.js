'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    function generateRandomComment() {
      const comments = ["This game is so good", "I love this game", "I hate this game", "This game is so bad", "This game is so boring", "This game is so fun", "This game is so addictive", "This game is so challenging", "This game is so easy", "This game is so hard", "This game is so interesting", "This game is so exciting", "This game is so cool", "This game is so awesome", "This game is so amazing", "This game is so fantastic", "This game is so great", "This game is so bad", "This game is so terrible", "This game is so awful"];
      const randomComment = comments[Math.floor(Math.random() * comments.length)];
  
      return randomComment;
    }

    function generateRandomRating() {
      const randomRating = Math.floor(Math.random() * 10) + 1; // Generates a random rating between 1 and 5
      return randomRating;
    }

    function generateRandomCommentData(uid, gid) {
        const randomComment = generateRandomComment();
        const randomRating = generateRandomRating();
        return {
            userId: uid,
            gameId: gid,
            status: "bought",
            isComment: true,
            comment: randomComment,
            rating: randomRating,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
    let Comments = [];
    for (let uid = 2; uid < 21; uid++) {
      for (let gid = 1; gid < 100; gid++) {
        if (Math.floor(Math.random() * 5) === 0) {
          Comments.push(generateRandomCommentData(uid, gid));
        }
      }
    }
    await queryInterface.bulkInsert('Wishlists', Comments, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Wishlists', null, {});
  }
};
