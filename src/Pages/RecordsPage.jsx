import React from 'react'
import Records from '../Components/Records'

export default function RecordsPage({selectedDomain}) {
  return (
    <div className='h-screen text-gray-700 dark:text-white dark:bg-gray-900'>
        <Records selectedDomain={selectedDomain} />
        </div>
  )
}
