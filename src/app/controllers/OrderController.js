import * as Yup from 'yup';
import Order from '../models/Order';

// O QUE COLOCAR NO SCHEMA
class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      repicient_id: Yup.number(),
      deliverymen_id: Yup.number(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data validation failed' });
    }

    const {
      product,
      canceled_at,
      start_date,
      end_date,
      repicient_id,
      deliverymen_id,
      signature_id,
    } = req.body;

    const order = await Order.create({
      product,
      canceled_at,
      start_date,
      end_date,
      repicient_id,
      deliverymen_id,
      signature_id,
    });

    return res.json(order);
  }
}

export default new OrderController();
