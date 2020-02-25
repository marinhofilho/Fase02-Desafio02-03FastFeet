import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliverymen from '../models/Deliverymen';

// O QUE COLOCAR NO SCHEMA
class OrderController {
  // talvez mudar para listar a order de cada recipient ou de cada deliveryman
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: Deliverymen,
          as: 'deliverymen',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      recipient_id: Yup.number(),
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
      recipient_id,
      deliverymen_id,
      signature_id,
    } = req.body;

    const hourStart = startOfHour(parseISO(start_date));

    const order = await Order.create({
      product,
      canceled_at,
      start_date,
      end_date,
      recipient_id,
      deliverymen_id,
      signature_id,
    });

    return res.json(order);
  }

  async update(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    const {
      product,
      canceled_at,
      start_date,
      end_date,
      recipient_id,
      deliverymen_id,
      signature_id,
    } = await order.update(req.body);

    return res.json({
      product,
      canceled_at,
      start_date,
      end_date,
      recipient_id,
      deliverymen_id,
      signature_id,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }
    order.destroy();

    return res.json({
      message: `Order ${order.product} was successfully deleted`,
    });
  }
}

export default new OrderController();
