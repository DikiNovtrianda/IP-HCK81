'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    function generateRandomName() {
      const firstNames = ["Liam", "Emma", "Noah", "Olivia", "Aiden", "Sophia", "Jackson", "Ava", "Lucas", "Mia", "Ujang", "Budi", "Joko", "Siti", "Ani", "Rina", "Dewi", "Dian", "Rudi", "Rina"];
      const lastNames = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Harris", "Martin", "White", "Clark", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera"];
  
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
      return `${randomFirstName} ${randomLastName}`;
    }

    function generateRandomUser() {
        const randomString = Math.floor(Math.random() * 100); // Generates a random string
        const randomName = generateRandomName();
        let item = {
            username: randomName,
            email: randomName.split(" ")[0] + randomString + `@example.com`,
            password: Math.random().toString(36).slice(-8), // Generates a random 8-character password
            createdAt: new Date(),
            updatedAt: new Date()
        };
        console.log(item);
        
        return item;
    }
    let Users = [];
    for (let i = 0; i < 20; i++) {
      Users.push(generateRandomUser());
    }
    await queryInterface.bulkInsert('Users', Users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
