import Sequelize from 'sequelize';

import Recepient from '../app/models/Recipient';
import User from '../app/models/User';
import Deliverymen from '../app/models/Deliverymen';
import File from '../app/models/File';
import Order from '../app/models/Order';

import databaseConfig from '../config/database';

const models = [Recepient, User, Deliverymen, File, Order];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
