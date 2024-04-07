import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddDomain() {
    const nav = useNavigate()
    const [domain, setDomain] = useState({
        name: '',
        description: '',
        type: '',
    });
    const [error, setError] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        const { name, description, type } = domain;

        axios.post('https://dns-backend-937x.onrender.com/add-hosted-zone', {
            name,
            description,
            type
        })
            .then(response => {
                if (response.data.error) {
                    
                    setError(response.data.error)
                    return;
                }
                // console.log('Hosted zone created successfully:', response.data);
                // hostedzoneid in form "/hostedzone/Z08816721ECWUN39WFSVT"
                setDomain({
                    name: '',
                    description: '',
                    type: ''
                });
               setError('')
                nav("/domains")
            })
            .catch(error => {
                console.error('Error creating hosted zone:', error);
            });
    }
    function handleChange(event) {
        const { name, value, checked, type } = event.target;
        const newValue = type === 'checkbox' ? checked : value;
        setDomain(prevDomain => ({
            ...prevDomain,
            [name]: newValue
        }));
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm min-h-sm my-auto mx-auto">
            <div className="mb-5 pt-2">
                <label htmlFor="name" className="input-label">Hosted Zone</label>
                <input type="text"
                    value={domain.name}
                    id="name" name="name"
                    className="input-container"
                    placeholder="example.com"
                    onChange={handleChange} required />
            </div>

            <div className="mb-5">
                <label htmlFor="description" className="input-label">Description - optional</label>
                <textarea id="description"
                    name="description"
                    value={domain.description}
                    className="input-container resize-none"
                    placeholder="The hosted zone is used for...."
                    onChange={handleChange}></textarea>
            </div>

            <div className="mb-5">
                <label className="input-label">Type</label>
                <div>
                    <label htmlFor="public" className="inline-flex items-center cursor-pointer">
                        <input type="checkbox"
                            id="public" name="type"
                            value="public"
                            onChange={handleChange}
                            className="mr-2"
                            required
                        />
                        Public
                    </label>
                </div>
            </div>
            <button type="submit" className="form-button">Add Domain</button>
            {error && <span className=" mt-2 flex text-lg justify-center text-red-700">{error}</span>}
        </form>
    );
}
