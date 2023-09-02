import React from 'react'
import Breadcrumbs from '../components/Breadcrumbs'

const UserProfile = () => {
  return (
    <div className={`w-full`}>
        <div className='w-full flex flex-col'>
          <Breadcrumbs />
        </div>
        <div className='w-full flex flex-row'>
          <div className={`w-1/5`}>

          </div>
          <div className={`w-4/5`}>
            
          </div>
        </div>
    </div>
  )
}

export default UserProfile