import * as Yup from 'yup';
import Problem from '../models/Problem';
import Order from '../models/Order';

class ProblemController {
  async index(req, res) {
    const problems = await Problem.findAll({
      order: [['id', 'ASC']],
      include: [
        {
          model: Order,
          as: 'order',
        },
      ],
    });

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      order_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { description, order_id } = req.body;

    const problem = await Problem.create({
      description,
      order_id,
    });

    return res.json(problem);
  }
}

export default new ProblemController();
