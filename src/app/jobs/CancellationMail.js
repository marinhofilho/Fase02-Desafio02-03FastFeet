import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { not } = data;
    console.log(not);
  }
}

export default new CancellationMail();

// import CancellationMail from '..'
