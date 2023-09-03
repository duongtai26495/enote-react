import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import ProfileCard from '../components/ProfileCard'

const UserProfile = () => {

  
  return (
    <div className={`w-full`}>
      <div className='w-full flex flex-col'>
        <Breadcrumbs text={"Back to previous"} />
      </div>
      <div className='w-full flex flex-col gap-2 lg:gap-0 lg:flex-row'>
        <div className={`w-full md:w-1/3 lg:w-1/5`}>
          <ProfileCard />
        </div>
        <div className={`w-full md:w-2/3 lg:w-4/5`}>

        </div>
      </div>
    </div >
  )
}

export default UserProfile