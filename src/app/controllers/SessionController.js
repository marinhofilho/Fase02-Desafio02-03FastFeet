import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import User from '../models/User';

// import Recipient from '../models/Recipient';

class SessionController {
  async store(req, res) {
    const { email, password_hash } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }

    if (!(await user.checkPassword(password_hash))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;
    // The MD5 hash for fastfeetmario is : 9f3439d2519769f3c4436db76204d546
    return res.json({
      user: {
        id,
        name,
        email,
        password_hash,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
