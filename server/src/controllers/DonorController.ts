import {Request, Response} from 'express';
import knex from '../database/connection';
import axios from 'axios';

require('dotenv/config');

const api = axios.create();

class DonorController {
    
    async show(request: Request, response: Response){
        const donors = await knex('donors').select('*');

        return response.json(donors);
    }

    async fetchDonors(){
        const date_ob = new Date();
        const day = String(date_ob.getDate());
        var month = String(date_ob.getMonth());
        if(month.length < 2) month = "0" + month;

        const year = String(date_ob.getFullYear());
        const due = year + "-" + month + "-" + String(Number(day) + 3);

        const donors = knex('donors').where('dueDate', day).select('*');
        (await donors).map(donor => {
            const data = {
                firstDueDate: due,
                numberOfPayments: 1,
                periodicity: 'monthly',
                amount: donor.value,
                instructions: 'Pagar o boleto em qualquer casa lotérica ou banco.',
                description: 'Doação para a Obra de Evangelização',
                customer: {
                    document: {
                        type: 'CPF',
                        value: donor.document
                    },
                    name: donor.name,
                    phone: {
                        areaCode: '11',
                        number: '000000000'
                    },
                    email: donor.email
                }
            }

            api.post(
                `https://ws.pagseguro.uol.com.br/recurring-payment/boletos?email=${process.env.EMAIL}&token=${process.env.TOKEN}`)
            .then(response => {
                console.log(response.data["boletos"][0].paymentLink);
            })

        });
    }
    
    
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

        await trx('donors').insert(donor);


        await trx.commit();

        return response.json(donor);

    }
};

export default DonorController;