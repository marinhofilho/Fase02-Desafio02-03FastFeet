import Sequelize, { Model } from 'sequelize';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    // brings recipient_id to order
    this.belongsTo(models.Deliverymen, {
      foreignKey: 'deliverymen_id',
      as: 'deliverymen',
    });
    // brings deliverymen_id to order
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
    // brings signature_id to order
    this.hasMany(models.Problem, { 
      foreignKey: 'order_id', 
      as: 'problems',
    })
  }
}

export default Order;
