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

  /* static associate(models) {
    this.hasOne(models.Order, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
     hasOne is used when the foreignKey exists on the target model 
    when working with an existing database it needs to refer the proper 
    foreignKey 
     it seems to be duplicated because Order.js has an association with BelongsTo
  } */
}

export default File;
