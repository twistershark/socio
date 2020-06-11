import {Request, Response} from 'express';
import knex from '../database/connection';

class DonorController {
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            phone,
            document,
            postalCode,
            street,
            number,
            district,
            complement,
            city,
            state,
            value,
            dueDate
        } = request.body;

        const trx = await knex.transaction();

        const donor = {
            name,
            email,
            phone,
            document,
            postalCode,
            street,
            number,
            district,
            complement,
            city,
            state,
            value,
            dueDate
        };

        const transaction = await trx('donors').insert(donor);
        console.log(transaction);

        await trx.commit();

        return response.json(donor);

    }
};

export default DonorController;