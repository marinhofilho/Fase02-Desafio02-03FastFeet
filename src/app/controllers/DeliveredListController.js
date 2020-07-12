import sequelize from 'sequelize';
import Deliverymen from '../models/Deliverymen';
import Order from '../models/Order';

class DeliveredListController {
  async show(req, res) {
    // show delivered orders
    const { id } = req.params;
    const deliverymen = await Deliverymen.findOne({
      where: { id },
      attributes: ['name', 'avatar_id', 'email'],
      include: [
        {
          model: Order,
          as: 'orders',
          where: { end_date: { [sequelize.Op.not]: null } },
          attributes: [
            'id',
            'product',
            'start_date',
            'signature_id',
            'end_date',
            'signature_id',
          ],
        },
      ],
    });
    return res.json(deliverymen);
  }
}
export default new DeliveredListController();
