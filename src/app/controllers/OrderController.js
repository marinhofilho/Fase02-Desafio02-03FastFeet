import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliverymen from '../models/Deliverymen';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Problem from '../models/Problem';

import Mail from '../../lib/Mail';

// O QUE COLOCAR NO SCHEMA
class OrderController {
  // talvez mudar para listar a order de cada recipient ou de cada deliveryman
  async index(req, res) {
    const { searchproduct } = req.query;

    if (searchproduct) {
      const orders = await Order.findAll({
        where: { product: { [Op.iLike]: `%${searchproduct}%` } },
        order: [['id', 'DESC']],
        attributes: [
          'id',
          'product',
          'canceled_at',
          'start_date',
          'end_date',
          'created_at',
          'signature_id',
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
            ],
          },
          {
            model: Deliverymen,
            as: 'deliverymen',
            attributes: ['id', 'name', 'email', 'avatar_id'],
          },
          {
            model: File,
            as: 'signature',
          },
        ],
      });

      return res.json(orders);
    }
    const orders = await Order.findAll({
      order: [['id', 'DESC']],
      attributes: [
        'id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
        'created_at',
        'signature_id',
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
          ],
        },
        {
          model: Deliverymen,
          as: 'deliverymen',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'signature',
        },
      ],
    });

    return res.json(orders);
  }

  async show(req, res) {
    const order = await Order.findByPk(req.params.id, {
      attributes: [
        'id',
        'recipient_id',
        'deliverymen_id',
        'signature_id',
        'product',
        'canceled_at',
        'start_date',
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
            'state',
            'city',
            'cep',
          ],
        },
        {
          model: Deliverymen,
          as: 'deliverymen',
          attibutes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
        /* Error: problem is not associated with Order
        {
          model: Problem,
          as: 'problems',
          attributes: ['id', 'description', 'createdAt'],
        }, */
      ],
    });
    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    return res.json(order);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number(),
      deliverymen_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data validation failed' });
    }

    const { product, recipient_id, deliverymen_id } = req.body;

    // not necessary so far
    // const hourStart = startOfHour(parseISO(start_date));

    const order = await Order.create({
      product,
      recipient_id,
      deliverymen_id,
    });

  /* Creation of docker containers of the email data is required!
  // Notify Deliverymen about order

    const recipient = await Recipient.findByPk(recipient_id);
    const orderCreationMoment = order.createdAt;

    const createFormattedDate = format(
      orderCreationMoment,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo pedido de ${recipient.name} feito em ${createFormattedDate}`,
      recipient: recipient_id,
      deliverymen: deliverymen_id,
    });

    const deliverymen = await Deliverymen.findByPk(deliverymen_id);
    
    Mail.sendMail({
      to: `${deliverymen.name} <${deliverymen.email}>`,
      subject: 'Entrega disponível',
      template: 'newOrder',
      context: {
        deliverymen: deliverymen.name,
        recipient: recipient.name,
        date: format(order.createdAt, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
        product: order.product,
      },
    });
    */

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
    /* FRONT_END: couldn't pass the current date with the body to execute de return message in json
    const { canceled_at } = req.body;
    console.log(canceled_at);
    order.update(req.body);

    const deleteMoment = parseISO(canceled_at);
    const deleteFormattedDate = format(
      deleteMoment,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    ); */

    await order.destroy();
    return res.json({
      // message: `Order ${order.product} was successfully canceled at ${deleteFormattedDate}`,
      message: `Order ${order.product} was successfully canceled.`,
    });
  }
}

export default new OrderController();
