import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      addition: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists!' });
    }
    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const { name } = req.body;
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);

    if (name !== recipient.name) {
      const recipientExists = await Recipient.findOne({
        where: { name },
      });

      if (recipientExists) {
        return res.status(400).json({ error: 'Recipient already exists!' });
      }
    }
    const {
      street,
      number,
      addition,
      state,
      city,
      cep,
    } = await recipient.update(req.body);

    return res.json({ name, street, number, addition, state, city, cep });
  }
}

export default new RecipientController();