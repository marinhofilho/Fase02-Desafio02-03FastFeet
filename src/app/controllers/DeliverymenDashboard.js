import Deliverymen from '../models/Deliverymen';
import Order from '../models/Order';

class DeliverymenDashboard {
  async show(req, res) {
    // show orders not yet delivered
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

  // order takeout - update with takeout time (start_date) - must be between 8 and 18
  async update(req, res) {
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: { id: orderId },
    });
    // problemas quando a start_date vem em unix time vs vem em formato normal
    // new Date() results Thu Apr 02 2020 22:57:06 GMT-0300 (Horário Padrão de Brasília)
    // new Date().getTime() results 1585879049508 - this will be used in goBarber
    // could not make it work here
    const { start_date } = req.body;

    if (!start_date) {
      return res.status(400).json({ error: 'Invalid Date' });
    }

    const entryDate = new Date(start_date);
    const entryDateHour = entryDate.getHours();
    console.log(entryDateHour);

    if (entryDateHour < 8) {
      return res
        .status(400)
        .json({ error: 'You are too soon, come back at 8am' });
    }
    if (entryDateHour > 18) {
      return res
        .status(400)
        .json({ error: 'You are past 6pm, come back tomorrow' });
    }

    await order.update(req.body);
    return res.json(order);
  }
}
export default new DeliverymenDashboard();
