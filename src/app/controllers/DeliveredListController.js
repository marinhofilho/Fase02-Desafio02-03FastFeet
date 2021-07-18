import sequelize from 'sequelize';
import Deliverymen from '../models/Deliverymen';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

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
            'created_at',
            'canceled_at',
            'signature_id',
            'end_date',
          ],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: [
                'id',
                'name',
                'street',
                'number',
                'addition',
                'city',
                'state',
                'cep',
              ],
            },
          ],
        },
      ],
    });
    return res.json(deliverymen);
  }
}
export default new DeliveredListController();
