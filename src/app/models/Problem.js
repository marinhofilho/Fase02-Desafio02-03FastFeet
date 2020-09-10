import Sequelize, { Model } from 'sequelize';

class Problem extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING(2048),
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
  }
}

export default Problem;
