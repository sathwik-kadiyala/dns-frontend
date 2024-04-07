import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddRecord from './AddRecord';
import ReportDetails from './ReportDetails';

export default function Records({ selectedDomain }) {
    const [records, setRecords] = useState([]);
    const recordTypes = ['Select', 'A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SOA', 'SRV', 'TXT', 'DNSSEC'];
    const [editingRecordIndex, setEditingRecordIndex] = useState(null);
    const [updatedRecordData, setUpdatedRecordData] = useState({
        name: '',
        type: '',
        ttl: '',
        value: '',
        oldval: '',
    });

    useEffect(() => {
        fetchRecords();
    }, [selectedDomain]);

    async function fetchRecords() {
        if (selectedDomain) {
            axios.get(`https://dns-backend-937x.onrender.com/get-dns-records?hostedZoneId=${selectedDomain.hostedZoneId}`)
                .then(response => {
                    setRecords(response.data);
                })
                .catch(error => {
                    console.error('Error fetching records:', error);
                });
        }
    }
// console.log(selectedDomain)
    const updateRecord = (updatedData) => {
        axios.put(`https://dns-backend-937x.onrender.com/update-dns-record/`, updatedData)
            .then(response => {
                console.log('Record updated successfully:', response.data);
                setEditingRecordIndex(null);
                setUpdatedRecordData({
                    oldName: '',
                    name: '',
                    type: '',
                    ttl: '',
                    value: '',
                });
                fetchRecords();
            })
            .catch(error => {
                console.error('Error updating record:', error);
            });
    };

    const deleteRecord = (record) => {
        axios.delete(`https://dns-backend-937x.onrender.com/delete-dns-record/${selectedDomain.hostedZoneId}/${record.Name}`, {
            data: { type: record.Type, ttl: record.TTL, value: record.ResourceRecords }
        })
            .then(response => {
                console.log('Record deleted successfully:', response.data);
                fetchRecords();
            })
            .catch(error => {
                console.error('Error deleting record:', error);
            });
    };
    const handleEdit = (recordIndex, record) => {
        setEditingRecordIndex(recordIndex);
        setUpdatedRecordData({
            name: record.Name,
            type: record.Type,
            ttl: record.TTL,
            value: record.ResourceRecords ? record.ResourceRecords.map(resource => resource.Value).join('\n') : '',
            oldValue: record.ResourceRecords ? record.ResourceRecords.map(resource => resource.Value) : [],
        });
    };

    const handleUpdate = (record) => {
        let updatedName = updatedRecordData.name;
        if (updatedRecordData.name !== record.Name) {
            updatedName = `${updatedRecordData.name}.${selectedDomain.name}`;
        }

        const updatedDataWithOldValue = {
            ...updatedRecordData,
            oldName: record.Name.slice(0, -1),
            oldttl: record.TTL,
            oldtype: record.Type,
            oldvalue: updatedRecordData.oldValue,

            hostedZoneId: selectedDomain.hostedZoneId,

            name: updatedName, 
            newvalue: updatedRecordData.value.split('\n')
        };

        updateRecord(updatedDataWithOldValue);
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
            <AddRecord fetchRecords={fetchRecords} selectedDomain={selectedDomain} />
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                    {records?.map((record, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {editingRecordIndex === index && index>=2 ? (
                                    <input
                                        type="text"
                                        value={updatedRecordData.name.split('.')[0]}
                                        onChange={(e) => setUpdatedRecordData({ ...updatedRecordData, name: e.target.value })}
                                        className="input-container"
                                    />
                                ) : (
                                    record.Name.split('.')[0]
                                )}
                            </th>
                            <td className="px-6 py-4 dark:text-white">
                                {editingRecordIndex === index && index>=2? (
                                    <select
                                        value={updatedRecordData.type}
                                        onChange={(e) => setUpdatedRecordData({ ...updatedRecordData, type: e.target.value })}
                                        className="input-container"
                                    >
                                        {recordTypes.map((type, idx) => (
                                            <option key={idx} value={type}>{type}</option>
                                        ))}
                                    </select>
                                ) : (
                                    record.Type
                                )}
                            </td>
                            <td className="px-6 py-4 dark:text-white">
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
                            <td className="px-6 py-4 w-3 dark:text-white">
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
                                {(
                                    editingRecordIndex === index ? (
                                        <>
                                            <button onClick={() => handleUpdate(record)} className="success">Save</button>
                                            <button onClick={handleCancelEdit} className="failure">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(index, record)} className="success">Edit</button>
                                            <button onClick={() => deleteRecord(record)} className="failure">Delete</button>
                                        </>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReportDetails records={records}/>
        </div>
    );
}
