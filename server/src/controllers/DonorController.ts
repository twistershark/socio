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

        const configAxiosHeader = { 
            headers: { 
                "Content-type": "application/json;charset=ISO-8859-1", 
                "Accept": "application/json;charset=ISO-8859-1" 
            } 
        }

        const date_ob = new Date();

        const day = String(date_ob.getDate());

        var month = String(date_ob.getMonth() + 1);
        if(month.length < 2) month = "0" + month;

        const year = String(date_ob.getFullYear());

        const due = year + "-" + month + "-" + String(Number(day) + 7);

        const donors = knex('donors').where('dueDate', day).select('*');
        (await donors).map(donor => {
            const data = {
                reference: "Sócio Evangelizador - Mel de Deus",
                firstDueDate: due,
                numberOfPayments: "1",
                periodicity: "monthly",
                amount: donor.value,
                instructions: "Boleto de doação",
                description: "Sócio Evangelizador - Com. Mel de Deus",
                customer: {
                    document: {
                        type: "CPF",
                        value: donor.document
                    },
                    name: donor.name,
                    email: donor.email,
                    phone: {
                        areaCode: donor.phoneDDD,
                        number: donor.phoneNumber
                    }
                }
            }

             api.post(`https://ws.pagseguro.uol.com.br/recurring-payment/boletos?email=${process.env.EMAIL}&token=${process.env.TOKEN}`, 
             data,
             configAxiosHeader
             ).then(response => {
                    console.log(response.data);
                }).catch(reject => {
                    console.log(reject);
                })
        });
    }
    
    
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            phoneDDD,
            phoneNumber,
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
            phoneDDD,
            phoneNumber,
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