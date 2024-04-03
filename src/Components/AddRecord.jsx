import React, { useState } from 'react';
import axios from 'axios';

export default function AddRecord({ selectedDomain,fetchRecords }) {
    const [record, setRecord] = useState({
        name: '',
        type: '',
        ttl: '',
        value: ''
    });
    // console.log(selectedDomain)
    function handleSubmit(event) {
        event.preventDefault();
        const { name, type, ttl, value } = record;
        const selectedDomainName  = selectedDomain.name; 
        const formattedName = `${name}.${selectedDomainName}`;
        const hostedZoneId = selectedDomain.hostedZoneId
        const valueArray = value.split('\n').map(val => val.trim());
        const resourceRecords = valueArray.map(val => ({ Value: val }));
    
        axios.post('http://localhost:5000/add-dns-record', {
            name: formattedName,
            type,
            ttl,
            value: resourceRecords,
            hostedZoneId
        })
            .then(response => {
                console.log('Record added successfully:', response.data);
    
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
    
    return (
        
        <form onSubmit={handleSubmit} className="max-w-sm min-h-sm my-auto mx-auto">
            <div className="mb-5 pt-2">
                <label htmlFor="name" className="input-label">Record name</label>
                <input type="text" value={record.name} id="name" name="name" className="input-container" placeholder="example.com" onChange={handleChange} />
            </div>
            <div className="mb-5">
                <label htmlFor="type" className="input-label">Record type</label>
                <input type="text" id="type" value={record.type} name="type" placeholder="A ,AA,AAAA,CNAME,MX,NS etc..." className="input-container" onChange={handleChange} />
            </div>
            <div className="mb-5">
                <label htmlFor="ttl" className="input-label">TTL (seconds)</label>
                <input type="text" id="ttl" value={record.ttl} name="ttl" className="input-container" onChange={handleChange} />
            </div>
            <div className="mb-5">
                <label htmlFor="value" className="input-label">Value/Route traffic to</label>
                <textarea id="value" name="value" value={record.value} className="input-container resize-none" placeholder="Enter multiple values on separate lines" onChange={handleChange}></textarea>
            </div>

            <button type="submit" className="mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
        </form>
        

        
    );
}