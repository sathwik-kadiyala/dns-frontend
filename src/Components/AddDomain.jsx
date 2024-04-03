import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddDomain() {
    const nav=useNavigate()
    const [domain, setDomain] = useState({
        name: '',
        description: '',
        type: '',
    });

    function handleSubmit(event) {
        event.preventDefault();
        const { name, description, type } = domain;

        axios.post('http://localhost:5000/add-hosted-zone', {
            name,
            description,
            type
        })
            .then(response => {
                console.log('Hosted zone created successfully:', response.data);
                setDomain({
                    name: '',
                    description: '',
                    type: ''
                });
                nav("/domains")
            })
            .catch(error => {
                console.error('Error creating hosted zone:', error);
            });
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setDomain(prevDomain => ({
            ...prevDomain,
            [name]: value
        }));
    }

    function handleTypeChange(event) {
        const { value} = event.target;
        setDomain(prevDomain => ({
            ...prevDomain,
            type: value
        }));
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm min-h-sm my-auto mx-auto">
            <div className="mb-5 pt-2">
                <label htmlFor="name" className="input-label">Hosted Zone</label>
                <input type="text" value={domain.name} id="name" name="name" className="input-container" placeholder="example.com" onChange={handleChange} />
            </div>
            <div className="mb-5">
                <label htmlFor="description" className="input-label">Description - optional</label>
                <textarea id="description" name="description" value={domain.description} className="input-container resize-none" placeholder="The hosted zone is used for...." onChange={handleChange}></textarea>
            </div>
            <div className="mb-5">
                <label className="input-label">Type</label>
                <div>
                    <label htmlFor="public" className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="public" name="type" value="public" checked={domain.type === 'public'} onChange={handleTypeChange} className="mr-2" required/>
                        Public
                    </label>
                </div>
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Domain</button>
        </form>
    );
}
