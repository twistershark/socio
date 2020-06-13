import express from 'express';

import DonorController from './controllers/DonorController';

const routes = express.Router();

const donorController = new DonorController();

routes.get('/donors', donorController.show);

routes.post('/donor', donorController.create);

donorController.fetchDonors();

export default routes;