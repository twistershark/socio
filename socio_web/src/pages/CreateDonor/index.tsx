import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

import './styles.css';

import logo from '../../assets/logo.svg';
import api from '../../services/api';

interface Address {
    postalCode: string;
    street: string;
    district: string;
    city: string;
    state: string;
}

const CreateDonor = () => {

    const [ dueDate, setDueDate ] = useState("");
    const [ postalCode, setPostalCode ] = useState("");
    const [ street, setStreet ] = useState("");
    const [ district, setDistrict ] = useState("");
    const [ city, setCity ] = useState("");
    const [ state, setState ] = useState("");

    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        whatsapp: '',
        document: '',
        value: '',
        number: '',
        complement: '',
    });

    const history = useHistory();

    useEffect(() => {
        if (postalCode.length < 8){
            return;
        }
        
        axios.get(`https://viacep.com.br/ws/${postalCode}/json/`).then(response => {
            setStreet(response.data["logradouro"]);
            setDistrict(response.data["bairro"]);
            setCity(response.data["localidade"]);
            setState(response.data["uf"]) 
        });
    }, [postalCode]);

    function handlePostalCodeInput(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;

        setPostalCode(value);
    };

    function handleinputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        
        setFormData({ ...formData, [name]: value });
    };

    function validate(document: string) {

        var total = 0;
        var remainder;
    
        if (document === "00000000000") return false;
            
        for (let i=1; i<=9; i++) total = total + parseInt(document.substring(i-1, i)) * (11 - i);
        remainder = (total * 10) % 11;
        
        if ((remainder === 10) || (remainder === 11))  remainder = 0;
        if (remainder !== parseInt(document.substring(9, 10)) ) return false;
        
        total = 0;
        for (let i = 1; i <= 10; i++) total = total + parseInt(document.substring(i-1, i)) * (12 - i);
        remainder = (total * 10) % 11;
        
        if ((remainder === 10) || (remainder === 11))  remainder = 0;
        if (remainder !== parseInt(document.substring(10, 11) ) ) return false;
        return true;
    
    }

    function handleDocumentChange(event: ChangeEvent<HTMLInputElement>){
        const value = event.target.value;

        if(value.length === 11){
            const correct = validate(value);
            if(correct === false){
                alert('CPF inválido');
            }
            setFormData({ ...formData, document: value });
        }
    }

    function handleDueDateChange(event: ChangeEvent<HTMLSelectElement>){
        const value = event.target.value;
        setDueDate(value);
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const {
            name, 
            email, 
            whatsapp, 
            document, 
            value, 
            number, 
            complement } = formData;

        const selectedDueDate = dueDate;
        const donorPostalCode = postalCode;
        const donorStreet = street;
        const donorDistrict = district;
        const donorCity = city;
        const donorState = state;
        const correctValue = Number(value) -1;

        const donorData = {
            name: name,
            email: email,
            phone: whatsapp,
            document: document,
            postalCode: donorPostalCode,
            street: donorStreet,
            number: number,
            district: donorDistrict,
            complement: complement,
            city: donorCity,
            state: donorState,
            value: String(correctValue),
            dueDate: selectedDueDate 
        }

        await api.post('donor', donorData);

        alert('Doador criado!');

        history.push('/');
    }

    return (
        <div id="page-create-donor">
            <header>
                <img src={logo} alt="Socio Evangelizador"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do Socio Evangelizador</h1>

                <fieldset>
                    <legend>
                        <h2>Doação</h2>
                    </legend>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="value">Valor da sua doação</label>
                            <input 
                                type="text"
                                name="value"
                                id="value"
                                required
                                onChange={handleinputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="dueDate">Data de vencimento</label>
                            <select 
                                onChange={handleDueDateChange}
                                name="dueDate"
                                id="dueDate"
                            >
                                <option value="1">Dia 1</option>
                                <option value="5">Dia 5</option>
                                <option value="10">Dia 10</option>
                                <option value="15">Dia 15</option>
                                <option value="20">Dia 20</option>
                                <option value="25">Dia 25</option>

                            </select>
                        </div>
                    </div>
                    
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome completo</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            required
                            onChange={handleinputChange}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            name="email"
                            id="email"
                            required
                            onChange={handleinputChange}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="phone">Telefone</label>
                        <input 
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            required
                            onChange={handleinputChange}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="document">CPF</label>
                        <input 
                            type="text"
                            name="document"
                            id="document"
                            required
                            onChange={handleDocumentChange}
                        />
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="postalCode">CEP</label>
                        <input 
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            required
                            onChange={handlePostalCodeInput}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="street">Rua</label>
                            <input 
                                type="text"
                                name="street"
                                id="street"
                                value={street}
                                required
                                onChange={handleinputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="number">Número</label>
                            <input 
                                type="text"
                                name="number"
                                id="number"
                                onChange={handleinputChange}
                            />
                        </div>
                    </div>
                    
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="district">Bairro</label>
                            <input 
                                type="text"
                                name="district"
                                id="district"
                                value={district}
                                required
                                onChange={handleinputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="complement">Complemento</label>
                            <input 
                                type="text"
                                name="complement"
                                id="complement"
                                onChange={handleinputChange}
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <input 
                                type="text"
                                name="city"
                                id="city"
                                value={city}
                                required
                                onChange={handleinputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="state">Estado</label>
                            <input 
                                type="text"
                                name="state"
                                id="state"
                                value={state}
                                required
                                onChange={handleinputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <button type="submit">Me cadastrar!</button>
            </form>
        </div>
    );
};

export default CreateDonor;