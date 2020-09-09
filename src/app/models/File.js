import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3334/files/${this.path}`;
          },
          // url in the model gave me access to the preview in the deliverymen/new (creation/store)
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasOne(models.Order, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default File;
