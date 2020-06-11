import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/logo.svg';

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Socio Evangelizador" />
                </header>

                <main>
                    <h1>Deseja ajudar essa obra de evangelização?</h1>
                    <p>Basta informar seus dados, escolher um valor que deseja
                        doar mensalmente e o dia que deseja receber o boleto de doação.
                    </p>

                    <Link to="/create-donor">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Quero me cadastrar!</strong>
                    </Link>
                </main>
            </div>
        </div>
    );
};

export default Home;