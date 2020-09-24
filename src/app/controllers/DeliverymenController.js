import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliverymen from '../models/Deliverymen';
import Order from '../models/Order';
import File from '../models/File';
// import File from '../models/File';

class DeliverymenController {
  async store(req, res) {
    const { name } = req.body;

    const DeliverymenExists = await Deliverymen.findOne({
      where: { name },
    });

    if (DeliverymenExists) {
      return res.status(400).json({ error: 'Deliverymen already exists!' });
    }

    /* const deliverymen = await Deliverymen.create(req.body, {
      include: [
        { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
      ],
    }); */

    const deliverymen = await Deliverymen.create(req.body);

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      avatar_id: Yup.number(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Backend validation failed' });
    }

    return res.json(deliverymen);
  }

  async index(req, res) {
    const { dname } = req.query;

    if (dname) {
      const deliverymen = await Deliverymen.findAll({
        where: { name: { [Op.iLike]: `%${dname}%` } },
        include: [
          {
            model: Order,
            as: 'orders',
          },
          {
            model: File,
            as: 'avatar',
          }
        ],
      });
      return res.json(deliverymen);
    }
    

    const deliverymen = await Deliverymen.findAll({
      include: [
        {
          model: Order,
          as: 'orders',
        },
        {
          model: File,
          as: 'avatar',
        }
      ],
    });
    return res.json(deliverymen);
  }

  async show(req, res) {
    const deliverymen = await Deliverymen.findByPk(req.params.id, {
      attributes: ['id', 'name', 'avatar_id', 'email'],
    });

    if (!deliverymen) {
      return res.status(400).json({ error: 'Deliverymen not found' });
    }
    return res.json(deliverymen);
  }

  async update(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    const deliverymen = await Deliverymen.findByPk(id);
    if (!deliverymen) {
      return res.status(400).json({ error: 'Deliverymen not found' });
    }

    if (name !== deliverymen.name) {
      const deliverymenExists = await Deliverymen.findOne({
        where: { name },
      });

      if (deliverymenExists) {
        return res.status(400).json({ error: 'Deliverymen already exists!' });
      }
    }
    const { avatar_id, email } = await deliverymen.update(req.body);

    return res.json({
      name,
      avatar_id,
      email,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const deliverymen = await Deliverymen.findByPk(id);
    if (!deliverymen) {
      return res.status(400).json({ error: 'Deliverymen not found' });
    }
    deliverymen.destroy();

    return res.json({ message: `${deliverymen.name} was deleted ` });
  }
}
export default new DeliverymenController();
