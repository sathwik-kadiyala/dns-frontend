import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from "Chart.js/auto";

export default function ReportDetails({ records }) {
    // console.log(records)

    const recordTypesData = getRecordTypesData();
    const recordsCountData = getRecordsCountData();


    function getRecordTypesData() {
        const types = {};
        records.forEach(record => {
            types[record.Type] = (types[record.Type] || 0) + 1;
        });
        return {
            labels: Object.keys(types),
            datasets: [{
                label: 'Record Types',
                data: Object.values(types),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: "black",
                borderWidth: 2,
            }],
        };
    }


    function getRecordsCountData() {
        const counts = {};
        records.forEach(record => {
            counts[record.Type] = (counts[record.Type] || 0) + 1;
        });
        return {
            labels: Object.keys(counts),
            datasets: [{
                label: 'Number of Records',
                data: Object.values(counts),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: '#000000',
                borderWidth: 2,
            }],
        };
    }

    return (
        <div className='flex  flex-row flex-wrap space-x-2 space-y-2 items-center justify-center'>
            <div className='flex-1 flex  justify-center  h-60 w-16'>
                <Pie data={recordTypesData} />
            </div>
            <div className=' flex-1 flex justify-center h-60 w-16' >
                <Bar data={recordsCountData} />
            </div>
        </div>
    );
};


