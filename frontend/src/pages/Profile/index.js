import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi'

import api from '../../services/api';
import logoImg from '../../assets/logo.svg'
import './styles.css'

export default function Profile() {
    const [incidents, setIncidents] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);

    const ong_id = localStorage.getItem('ong_id');
    const ong_name = localStorage.getItem('ong_name');
    
    const history = useHistory()

    useEffect(() => {
        api.get(`profile?page=${page}`, {
            headers: {
                authorization: ong_id
            }
        }).then(response => {
           setIncidents(response.data.incidents)

           const totalIncidents = response.headers["count-total"]
           setTotal(Math.ceil(totalIncidents / 6))
        })
    }, [ong_id, page])
    
    async function handleDeleteIncidents(id) {
        try {
            api.delete(`incidents/${id}`, {
                headers: {
                    authorization: ong_id
                }
            })

            setIncidents(incidents.filter(incident => incident.id !== id))
        } catch (err) {
            alert('Erro ao deletar incidente, tente novamente.')
        }
    }

    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero"/>
                <span>Bem vinda, {ong_name}</span>

                <Link to="/incidents/new" className="button">Cadastrar novo caso</Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#E02041"/>
                </button>
            </header>

            <div className="base-profile">
                <h1>Casos cadastrados</h1>
                <div className="page-dashboard">
                    <button type="button" onClick={() => {((page - 1) !== 0) ? setPage(page - 1) : alert('Já está na primeira página.')}}>Página anterior</button>
                    <button type="button" onClick={() => {((page + 1) <= total) ? setPage(page + 1) : alert('Já está na última página.')}}>Próxima página</button>
                </div>
            </div>
            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>Caso: </strong>
                        <p>{incident.title}</p>
                        
                        <strong>DESCRIÇÂO: </strong>
                        <p>{incident.description}</p>
                        
                        <strong>VALOR: </strong>
                        <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

                        <button type="button" onClick={() => handleDeleteIncidents(incident.id)}>
                            <FiTrash2 size={20} color="#a8a8b3"/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
