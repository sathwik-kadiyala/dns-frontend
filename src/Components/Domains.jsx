import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Domains({ onSelectDomain }) {
    const [domains, setDomains] = useState([]);

    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get('https://dns-backend-937x.onrender.com/get-domains')
            .then(response => {
                setDomains(response.data.domains);
            })
            .catch(error => {
                console.error('Error fetching domains:', error);
            });
    }, []);

    const handleDeleteDomain = (hostedZoneId) => {
        axios.delete(`https://dns-backend-937x.onrender.com/delete-hosted-zone/${hostedZoneId}`)
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

                                <button onClick={() => onSelectDomain(domain)}
                                    className="success">
                                    View
                                </button>
                                <button onClick={() => handleDeleteDomain(domain.hostedZoneId)} className="failure">
                                    Delete
                                </button>

                            </td>


                        </tr>
                    ))}
                </tbody>

            </table>

            {error && <p className='text-lg text-red-600 animate-pulse'>To delete the hosted zone, first delete all records except the first two (which are the SOA and NS records) and then delete hosted zone GOTO view for deleting records</p>}
        </div>
    );
}
