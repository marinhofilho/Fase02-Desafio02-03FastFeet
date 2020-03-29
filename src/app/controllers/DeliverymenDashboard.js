import Deliverymen from '../models/Deliverymen';
import Order from '../models/Order';

class DeliverymenDashboard {
  async show(req, res) {
    const { id } = req.params;
    const deliverymen = await Deliverymen.findOne({
      where: { id },
      attributes: ['name', 'avatar_id', 'email'],
      include: [
        {
          model: Order,
          as: 'orders',
          where: { canceled_at: null, end_date: null },
          attributes: ['id', 'product', 'start_date', 'signature_id'],
        },
      ],
    });
    return res.json(deliverymen);
  }

  async update(req, res) {
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: { id: orderId },
    });
    // const { start_date }
    await order.update(req.body);
    return res.json(order);
  }
}
export default new DeliverymenDashboard();
