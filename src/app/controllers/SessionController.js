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
    // The MD5 hash for fastfeetv2 is : 0ca0ea12e3561d15d69b2bed899ba3af
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
