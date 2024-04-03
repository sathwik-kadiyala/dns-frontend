import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddRecord from './AddRecord';

export default function Records({ selectedDomain }) {
    const [records, setRecords] = useState([]);
    const [editingRecordIndex, setEditingRecordIndex] = useState(null);
    const [updatedRecordData, setUpdatedRecordData] = useState({
        name: '',
        type: '',
        ttl: '',
        value: ''
    });

    useEffect(() => {
        fetchRecords();
    }, [selectedDomain]);

    async function fetchRecords() {
        if (selectedDomain) {
            axios.get(`https://dns-backend-937x.onrender.com/get-dns-records?hostedZoneId=${selectedDomain.hostedZoneId}`)
                .then(response => {
                   const subdomainRecords = response.data.map(record => ({
                        ...record,
                        Name: record.Name.split('.')[0] // Take only the first part of the name
                    }));
                    setRecords(subdomainRecords);
                })
                .catch(error => {
                    console.error('Error fetching records:', error);
                });
        }
    }

    const updateRecord = ( updatedData) => {
        
        axios.put(`https://dns-backend-937x.onrender.com/update-dns-record/`, updatedData)
            .then(response => {
                console.log('Record updated successfully:', response.data);
                // Clear editing state
                setEditingRecordIndex(null);
                setUpdatedRecordData({
                    name: '',
                    type: '',
                    ttl: '',
                    value: '',

                });
                // Fetch records again to reflect changes
                fetchRecords();
            })
            .catch(error => {
                console.error('Error updating record:', error);
            });
    };

    const handleEdit = (recordIndex, record) => {
        setEditingRecordIndex(recordIndex);
        setUpdatedRecordData({
            
            name: record.Name,
            type: record.Type,
            ttl: record.TTL,
            value: record.ResourceRecords ? record.ResourceRecords.map(resource => resource.Value).join('\n') : ''
        });
    };

    const handleUpdate = () => {
        // Split the value string by newline character to create an array
        const updatedDataWithArrayValue = {
            ...updatedRecordData,
            hostedZoneId:selectedDomain.hostedZoneId,
            value: updatedRecordData.value.split('\n')
        };
        updateRecord( updatedDataWithArrayValue);
    };

    const handleCancelEdit = () => {
        setEditingRecordIndex(null);
        setUpdatedRecordData({
            name: '',
            type: '',
            ttl: '',
            value: ''
        });
    };

    return (
        <div className="h-screen relative overflow-x-scroll">
            <AddRecord fetchRecords={fetchRecords} selectedDomain={selectedDomain}/>
            <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-800 uppercase bg-gray-300 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Record name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Record type
                        </th>
                        <th scope="col" className="px-6 py-3">
                            TTL (seconds)
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Value/Route traffic to
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {editingRecordIndex === index ? (
                                    <input
                                        type="text"
                                        value={updatedRecordData.name}
                                        onChange={(e) => setUpdatedRecordData({ ...updatedRecordData, name: e.target.value })}
                                        className="input-container"
                                    />
                                ) : (
                                    record.Name
                                )}
                            </th>
                            <td className="px-6 py-4">
                                {editingRecordIndex === index ? (
                                    <input
                                        type="text"
                                        value={updatedRecordData.type}
                                        onChange={(e) => setUpdatedRecordData({ ...updatedRecordData, type: e.target.value })}
                                        className="input-container"
                                    />
                                ) : (
                                    record.Type
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {editingRecordIndex === index ? (
                                    <input
                                        type="text"
                                        value={updatedRecordData.ttl}
                                        onChange={(e) => setUpdatedRecordData({ ...updatedRecordData, ttl: e.target.value })}
                                        className="input-container"
                                    />
                                ) : (
                                    record.TTL
                                )}
                            </td>
                            <td className="px-6 py-4 w-3">
                                {editingRecordIndex === index ? (
                                    <textarea
                                        value={updatedRecordData.value}
                                        onChange={(e) => setUpdatedRecordData({ ...updatedRecordData, value: e.target.value })}
                                        className="input-container resize-none"
                                    />
                                ) : (
                                    record.ResourceRecords && record.ResourceRecords.map((resource, index) => (
                                        <React.Fragment key={index}>
                                            <span>{resource.Value}</span>
                                            <br />
                                        </React.Fragment>
                                    ))
                                )}
                            </td>
                            <td className="px-6 py-4 w-3">
                                { (
                                    editingRecordIndex === index ? (
                                        <>
                                            <button onClick={handleUpdate} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg  text-sm  w-20 px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Save</button>
                                            <button onClick={handleCancelEdit} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(index, record)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 w-20 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Edit</button>
                                        </>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}
