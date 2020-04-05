import Order from '../models/Order';

// To use when the order is delivered - end_date && delivered: true
class DeliveredOrder {
  async update(req, res) {
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: { id: orderId },
    });
    const { end_date } = req.body;

    if (!end_date) {
      return res.status(400).json({ error: 'Invalid Date' });
    }
    // Update não acrescenta nem mostra no console.log o delivered
    await order.update(req.body);
    console.log(order);

    return res.json(order);
  }
}

export default new DeliveredOrder();
