import express from 'express';
import cron from 'node-cron';

import DonorController from './controllers/DonorController';

const routes = express.Router();

const donorController = new DonorController();

routes.get('/donors', donorController.show);

routes.post('/donor', donorController.create);


cron.schedule("0 1 * * *", () => {
    donorController.fetchDonors()
});

export default routes;