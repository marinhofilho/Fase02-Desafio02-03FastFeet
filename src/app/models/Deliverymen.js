import Sequelize, { Model } from 'sequelize';

class Deliverymen extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        avatar_id: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Order, {
      foreignKey: 'deliverymen_id',
      as: 'orders',
    });
  }
}

export default Deliverymen;
