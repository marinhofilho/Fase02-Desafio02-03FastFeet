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
    // this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    // added when had problem to create deliverymen via web. need to check functionality asap
    // apparently it doesn't relate to preview of avatar on deliverymen creation
  }
}

export default Deliverymen;
