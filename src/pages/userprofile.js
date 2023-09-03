import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import ProfileCard from '../components/ProfileCard'
import ProfileAnalytics from '../components/ProfileAnalytics'

const UserProfile = () => {


  return (
    <div className={`w-full`}>
      <div className='w-full flex flex-col'>
        <Breadcrumbs text={"Back to previous"} />
      </div>
      <div className='w-full flex flex-col gap-3 lg:flex-row pt-5'>
        <div className={`w-full md:w-1/3 `}>
          <ProfileCard />
        </div>
        <div className={`w-full md:w-2/3 `}>
          <ProfileAnalytics />
        </div>
      </div>
    </div >
  )
}

export default UserProfile