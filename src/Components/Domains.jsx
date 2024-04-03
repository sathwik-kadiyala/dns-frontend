import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Domains({ onSelectDomain }) {
    const [domains, setDomains] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/get-domains')
            .then(response => {
                // console.log('Domains fetched successfully:', response.data);
                setDomains(response.data.domains);
            })
            .catch(error => {
                console.error('Error fetching domains:', error);
            });
    }, []);

    const handleDeleteDomain = (hostedZoneId) => {
        axios.delete(`http://localhost:5000/delete-hosted-zone/${hostedZoneId}`)
            .then(response => {
                console.log('Hosted zone deleted successfully:', response.data);
                setError(false);
                setDomains(domains.filter(domain => domain.hostedZoneId !== hostedZoneId));
            })
            .catch(error => {
                setError(true);
                // alert()
                console.error('Error deleting hosted zone:', error);
            });
    };

    return (
        <div className="h-screen dark:bg-gray-900 relative overflow-x-scroll">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-800 uppercase bg-gray-300 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Domain Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {domains?.map((domain, index) => (
                        <tr key={index} >
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {domain.name}
                            </td>
                            <td className="px-6 py-4">
                                <button onClick={() => onSelectDomain(domain)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg  text-sm  w-20 px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">View</button>
                                <button onClick={() => handleDeleteDomain(domain.hostedZoneId)} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                            </td>

                        </tr>
                    ))}
                </tbody>
              
            </table>
            {error && <p className='text-red-600 animate-pulse'>To delete the hosted zone delete all records except the first two (which are the SOA and NS records and then delete hosted zone GOTO view for deleting records</p>}
        </div>
    );
}
