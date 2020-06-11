import express from 'express';

import DonorController from './controllers/DonorController';

const routes = express.Router();

const donorController = new DonorController();

routes.post('/donor', donorController.create);

export default routes;