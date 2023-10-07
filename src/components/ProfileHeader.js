import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import LoadingComponent from "./LoadingComponent"
import { checkActivateUser, checkToken, logoutAccount } from '../utils/functions'
import { ACCESS_TOKEN, LOCAL_USER, URL_PREFIX } from '../utils/constants'
import CustomLazyLoadedImage from "./CustomLazyLoadedImage"
import Cookies from 'js-cookie'
import profile_default from '../assets/images/default_profile.jpg'

const ProfileHeader = () => {
    
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [isLogout, setLogout] = useState(false)
    const accountMenuRef = useRef(null)
    const [isLogoutBadge, setLogoutBadge] = useState(false)

    const checkLogin = async () => {
        const token = Cookies.get(ACCESS_TOKEN)
        if (checkToken(token)) {
            let isActivated = await checkActivateUser(token)
            if (!isActivated) {
                navigate("/activate-account")
            }
        } else {
            navigate("/login?unlogin")
            setLogout(false)
        }
    }

    useEffect(() => {
        checkLogin()
    }, [])

    const logout = () => {
        setLogout(true)
        logoutAccount()
        checkLogin()
    }

    const profileDirect = () => {
        navigate("/profile")
        toggleLogoutBadge()
    }

    const toggleLogoutBadge = () => setLogoutBadge(preState => !preState)


    const userInfo = JSON.parse(localStorage.getItem(LOCAL_USER))
    let profileImage = ""

    if (userInfo && userInfo.profile_image) {
        profileImage = `${URL_PREFIX}public/image/${userInfo.profile_image}`
    } else {
        profileImage = profile_default
    }
    return (
        <div className='relative'>
            <div onClick={toggleLogoutBadge} className="min-w-fit cursor-pointer text-center w-fit whitespace-nowrap justify-end px-2 flex flex-row gap-2 items-center text-slate-700">
                <CustomLazyLoadedImage
                    className={`aspect-square object-cover rounded-full w-6 h-6`}
                    src={`${profileImage}`}
                />
                {
                    userInfo &&
                    <>
                        <span className="hidden lg:block">
                            <strong>{userInfo.f_name} {userInfo.l_name}</strong>
                        </span>
                        <svg className={`${isLogoutBadge ? "rotate-180" : "rotate-0"} hidden lg:block transition-all fill-slate-700 h-3 w-3`} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 330 330">
                            <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
                                    c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
                                    s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"/>
                        </svg>
                    </>
                }
            </div>
            <div
                ref={accountMenuRef}
                className={`w-fit border absolute z-50 right-0 top-10 ${isLogoutBadge ? "h-fit opacity-100" : "h-0 opacity-0"} overflow-hidden transition-all bg-white rounded-lg`}>
                <p className="flex cursor-pointer flex-row gap-2 whitespace-nowrap justify-between items-center bg-white rounded-sm lg:hover:bg-slate-100 transition-all p-2 " onClick={() => { profileDirect() }}>
                    <span className="text-sm">{t('user.profile')}</span>
                    <svg width="21" height="21" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="info" /><g id="icons"><g id="user"><ellipse cx="12" cy="8" rx="5" ry="6" /><path d="M21.8,19.1c-0.9-1.8-2.6-3.3-4.8-4.2c-0.6-0.2-1.3-0.2-1.8,0.1c-1,0.6-2,0.9-3.2,0.9s-2.2-0.3-3.2-0.9    C8.3,14.8,7.6,14.7,7,15c-2.2,0.9-3.9,2.4-4.8,4.2C1.5,20.5,2.6,22,4.1,22h15.8C21.4,22,22.5,20.5,21.8,19.1z" /></g></g></svg>
                </p>
                <p className={`flex cursor-pointer flex-row gap-2 whitespace-nowrap justify-between items-center bg-white rounded-sm lg:hover:bg-slate-100 transition-all p-2 `}
                    onClick={() => logout()} >
                    {
                        isLogout
                            ?
                            <LoadingComponent size={`w-5 h-5`} className={`flex w-full`} />
                            :
                            <>
                                <span className="text-sm">{t('user.logout')}</span>
                                <svg width="21" height="21" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M918.857143 763.428571h-80.342857c-5.485714 0-10.628571 2.4-14.057143 6.628572-8 9.714286-16.571429 19.085714-25.6 28a404.388571 404.388571 0 0 1-128.8 86.742857A403.2 403.2 0 0 1 512.457143 916.571429c-54.742857 0-107.771429-10.742857-157.6-31.771429a404.388571 404.388571 0 0 1-128.8-86.742857 403.748571 403.748571 0 0 1-86.857143-128.571429C118.057143 619.657143 107.428571 566.742857 107.428571 512s10.742857-107.657143 31.771429-157.485714c20.342857-48.114286 49.6-91.428571 86.857143-128.571429s80.571429-66.4 128.8-86.742857c49.828571-21.028571 102.857143-31.771429 157.6-31.771429 54.742857 0 107.771429 10.628571 157.6 31.771429 48.228571 20.342857 91.542857 49.6 128.8 86.742857 9.028571 9.028571 17.485714 18.4 25.6 28 3.428571 4.228571 8.685714 6.628571 14.057143 6.628572H918.857143c7.2 0 11.657143-8 7.657143-14.057143C838.857143 110.285714 685.485714 20.114286 511.2 20.571429 237.371429 21.257143 17.828571 243.542857 20.571429 517.028571 23.314286 786.171429 242.514286 1003.428571 512.457143 1003.428571c173.828571 0 326.514286-90.057143 414.057143-225.942857 3.885714-6.057143-0.457143-14.057143-7.657143-14.057143z m101.6-258.628571L858.285714 376.8c-6.057143-4.8-14.857143-0.457143-14.857143 7.2v86.857143H484.571429c-5.028571 0-9.142857 4.114286-9.142858 9.142857v64c0 5.028571 4.114286 9.142857 9.142858 9.142857h358.857142v86.857143c0 7.657143 8.914286 12 14.857143 7.2l162.171429-128a9.142857 9.142857 0 0 0 0-14.4z" /></svg>
                            </>
                    }
                </p>
            </div>
        </div>
    )
}

export default ProfileHeader