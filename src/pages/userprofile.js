import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import ProfileCard from '../components/ProfileCard'
import ProfileAnalytics from '../components/ProfileAnalytics'
import CustomLazyLoadedImage from '../components/CustomLazyLoadedImage'

const UserProfile = () => {

  const [profileImage, setProfileImage] = useState("")

  const profileImageUrl = (value) => {
    setProfileImage(value)
  }


  return (
    <>
      <div className={`w-full relative`}>
        <div className='w-full flex flex-col'>
          <Breadcrumbs text={"Back to previous"} />
        </div>
        <div className='w-full flex flex-col gap-3 sm:flex-row pt-5'>
          <div className={`w-full sm:w-1/3 `}>
            <ProfileCard profileImageUrl={profileImageUrl} />
          </div>
          <div className={`w-full sm:w-2/3 `}>
            <ProfileAnalytics />
          </div>
        </div>
      </div>
      <div className={`${profileImage ? "block" : "hidden"} absolute top-12 left-0 w-full h-fit bg-black z-50 overflow-hidden object-contain border-8 border-teal-600`}>
        <CustomLazyLoadedImage src={profileImage} className='h-fit w-fit object-contain m-auto object-center max-height-image'/>
        <button onClick={() => setProfileImage("")} className='absolute top-5 right-5 p-2 rounded-full bg-opacity-100 bg-white lg:bg-opacity-70 lg:hover:bg-opacity-100 text-sm'>Close</button>
      </div>
    </>
  )
}

export default UserProfile