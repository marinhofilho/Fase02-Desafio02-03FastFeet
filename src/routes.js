import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import DeliverymenController from './app/controllers/DeliverymenController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import DeliveriesController from './app/controllers/DeliveriesController';
import DeliverymenDashboard from './app/controllers/DeliverymenDashboard';
import DeliveredListController from './app/controllers/DeliveredListController';
import NotificationController from './app/controllers/NotificationController';
import ProblemController from './app/controllers/ProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// show finished deliveries
routes.get('/deliverymen/:id/deliveriesfinished', DeliveredListController.show);

// show all deliveries that aren't yet finished
routes.get('/deliverymen/:id/deliveries', DeliverymenDashboard.show);

// inserts start_date to start deliver activity
routes.put('/deliverymen/:id/deliveries/:orderId', DeliverymenDashboard.update);

// Inserts end_date and ends order life cycle
routes.put(
  '/deliverymen/:id/deliveries/:orderId/finalize',
  upload.single('file'),
  DeliveriesController.update
);

// Creates session
routes.post('/sessions', SessionController.store);

// Below this line registration is required
routes.use(authMiddleware);

// Recipients routes
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients', RecipientController.index);
routes.delete('/recipients/:id', RecipientController.delete);

// Deliveryboys routes
routes.post('/deliverymen', DeliverymenController.store);
routes.get('/deliverymen', DeliverymenController.index);
routes.put('/deliverymen/:id', DeliverymenController.update);
routes.delete('/deliverymen/:id', DeliverymenController.delete);

routes.post('/files', upload.single('file'), FileController.store);

// Order manipulation routes
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);
routes.get('/orders', OrderController.index);
routes.get('/orders/:id', OrderController.show);

// Notification routes
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

// Problem routes
routes.get('/problems', ProblemController.index);
routes.post('/problems', ProblemController.store);

export default routes;
