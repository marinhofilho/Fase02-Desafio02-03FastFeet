module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'delivered', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('orders', 'delivered');
  },
};
