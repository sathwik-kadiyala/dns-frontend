import React, { useState } from 'react';
import axios from 'axios';

export default function AddRecord({ selectedDomain, fetchRecords }) {
    const [record, setRecord] = useState({
        name: '',
        type: '',
        ttl: '',
        value: ''
    });
    const [error, setError] = useState('');
    const recordTypes = ['Select', 'A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SOA', 'SRV', 'TXT', 'DNSSEC'];
    // console.log(selectedDomain)
    function handleSubmit(event) {
        event.preventDefault();
        const { name, type, ttl, value } = record;

        const formattedName = `${name}.${selectedDomain.name}`;
        const hostedZoneId = selectedDomain.hostedZoneId
        const valueArray = value.split('\n').map(val => val.trim());
        const resourceRecords = valueArray.map(val => ({ Value: val }));

        axios.post('https://dns-backend-937x.onrender.com/add-dns-record', {
            name: formattedName,
            type,
            ttl,
            value: resourceRecords,
            hostedZoneId
        })
            .then(response => {
                if (response.data.error) {
                   
                    setError(response.data.error)
                    return;
                }
                console.log('Record added successfully:', response.data);
                setError('')
                setRecord({
                    name: '',
                    type: '',
                    ttl: '',
                    value: ''
                });
                fetchRecords();
            })
            .catch(error => {
                console.error('Error adding record:', error);
            });
    }



    function handleChange(event) {
        const { name, value } = event.target;
        setRecord(prevRecord => ({
            ...prevRecord,
            [name]: value
        }));
    }

    function handleTypeChange(event) {
        const { value } = event.target;
        setRecord(prevRecord => ({
            ...prevRecord,
            type: value
        }));
    }

    return (

        <form onSubmit={handleSubmit} className="max-w-sm min-h-sm my-auto mx-auto">

            <div className="mb-5 pt-2">
                <label htmlFor="name" className="input-label">Record name</label>
                <input type="text"
                    value={record.name}
                    id="name"
                    name="name"
                    className="input-container"
                    placeholder="example.com" onChange={handleChange} />
            </div>

            <div className="mb-5">
                <label htmlFor="type" className="input-label">Record type</label>
                <select
                    id="type"
                    value={record.type}
                    name="type"
                    className="input-container"
                    onChange={handleTypeChange}
                >
                    {recordTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="mb-5">
                <label htmlFor="ttl" className="input-label">TTL (seconds)</label>
                <input
                    type="text"
                    id="ttl"
                    value={record.ttl}
                    name="ttl" className="input-container"
                    onChange={handleChange} />
            </div>

            <div className="mb-5">
                <label htmlFor="value" className="input-label">Value/Route traffic to</label>
                <textarea id="value"
                    name="value"
                    value={record.value}
                    className="input-container resize-none"
                    placeholder="Enter multiple values on separate lines"
                    onChange={handleChange}></textarea>
            </div>

            {error && <span className=" my-2 flex text-lg justify-center text-red-700">{error}</span>}

            <button type="submit" className="mb-5 form-button">Add</button>
        </form>



    );
}