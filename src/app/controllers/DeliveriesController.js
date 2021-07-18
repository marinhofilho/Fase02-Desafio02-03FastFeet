import Order from '../models/Order';
import File from '../models/File';

// inserts end_date in delivery
class DeliveriesController {
  async update(req, res) {
    const { orderId } = req.params;
    console.log(orderId);
    const order = await Order.findOne({
      where: { id: orderId },
    });
    const { end_date } = req.body;
    if (!end_date) {
      return res.status(400).json({ error: 'Invalid Date' });
    }
    // const { end_date }

    /* const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    }); */

    const updatedOrder = await order.update(req.body);

    return res.json(updatedOrder);
  }
}
export default new DeliveriesController();

// managed to send the file, but unable to link it to the signature_id in order
