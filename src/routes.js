import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import DeliverymenController from './app/controllers/DeliverymenController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import DeliverymenDashboard from './app/controllers/DeliverymenDashboard';
import DeliveriesController from './app/controllers/DeliveriesController';

import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/deliverymen/:id/deliveries', DeliverymenDashboard.show);
routes.put('/deliverymen/:id/deliveries/:orderId', DeliverymenDashboard.update);

routes.put('/deliverymen/:id/deliveries/:orderId', DeliveriesController.update);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliverymen', DeliverymenController.store);
routes.get('/deliverymen', DeliverymenController.index);
routes.put('/deliverymen/:id', DeliverymenController.update);
routes.delete('/deliverymen/:id', DeliverymenController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);
routes.get('/orders/', OrderController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
