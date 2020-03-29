import Order from '../models/Order';

class DeliveriesController {
  async update(req, res) {
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: { id: orderId },
    });
    // const { end_date }
    await order.update(req.body);
    return res.json(order);
  }
}
export default new DeliveriesController();
