import { checkToken, loadNavigationItem } from "../utils/functions"
import { useEffect, useState } from "react"
import { access_token, currentNavItem, localUser } from "../utils/constants"
import Cookies from "js-cookie"
import { Link, useNavigate, useRoutes } from "react-router-dom"



const Header = () => {

    const navigate = useNavigate()
    const checkLogin = () => {
        const token = Cookies.get(access_token)
        !checkToken(token) && navigate("/login?unlogin")

    }

    const logout = () => {
        Cookies.remove(access_token)
        localStorage.removeItem(localUser)
        checkLogin()
    }

    const userInfo = JSON.parse(localStorage.getItem(localUser))

    const [isLogoutBadge, setLogoutBadge] = useState(false)

    const toggleLogoutBadge = () => setLogoutBadge(preState => !preState)

    useEffect(() => {

        checkLogin()
    }, [])

    return (
        <div className={`2xl:w-full 2xl:mx-auto `}>
            <div className="p-3">
                <nav className="flex justify-between">
                    <div className="lg:pr-16 pr-6">
                        <Link className="flex items-center space-x-3 flex-row " to={"/"}>
                            <svg className="cursor-pointer" width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 17H0H1ZM7 17H6H7ZM17 27V28V27ZM27 17H28H27ZM17 0C12.4913 0 8.1673 1.79107 4.97918 4.97918L6.3934 6.3934C9.20644 3.58035 13.0218 2 17 2V0ZM4.97918 4.97918C1.79107 8.1673 0 12.4913 0 17H2C2 13.0218 3.58035 9.20644 6.3934 6.3934L4.97918 4.97918ZM0 17C0 21.5087 1.79107 25.8327 4.97918 29.0208L6.3934 27.6066C3.58035 24.7936 2 20.9782 2 17H0ZM4.97918 29.0208C8.1673 32.2089 12.4913 34 17 34V32C13.0218 32 9.20644 30.4196 6.3934 27.6066L4.97918 29.0208ZM17 34C21.5087 34 25.8327 32.2089 29.0208 29.0208L27.6066 27.6066C24.7936 30.4196 20.9782 32 17 32V34ZM29.0208 29.0208C32.2089 25.8327 34 21.5087 34 17H32C32 20.9782 30.4196 24.7936 27.6066 27.6066L29.0208 29.0208ZM34 17C34 12.4913 32.2089 8.1673 29.0208 4.97918L27.6066 6.3934C30.4196 9.20644 32 13.0218 32 17H34ZM29.0208 4.97918C25.8327 1.79107 21.5087 0 17 0V2C20.9782 2 24.7936 3.58035 27.6066 6.3934L29.0208 4.97918ZM17 6C14.0826 6 11.2847 7.15893 9.22183 9.22183L10.636 10.636C12.3239 8.94821 14.6131 8 17 8V6ZM9.22183 9.22183C7.15893 11.2847 6 14.0826 6 17H8C8 14.6131 8.94821 12.3239 10.636 10.636L9.22183 9.22183ZM6 17C6 19.9174 7.15893 22.7153 9.22183 24.7782L10.636 23.364C8.94821 21.6761 8 19.3869 8 17H6ZM9.22183 24.7782C11.2847 26.8411 14.0826 28 17 28V26C14.6131 26 12.3239 25.0518 10.636 23.364L9.22183 24.7782ZM17 28C19.9174 28 22.7153 26.8411 24.7782 24.7782L23.364 23.364C21.6761 25.0518 19.3869 26 17 26V28ZM24.7782 24.7782C26.8411 22.7153 28 19.9174 28 17H26C26 19.3869 25.0518 21.6761 23.364 23.364L24.7782 24.7782ZM28 17C28 14.0826 26.8411 11.2847 24.7782 9.22183L23.364 10.636C25.0518 12.3239 26 14.6131 26 17H28ZM24.7782 9.22183C22.7153 7.15893 19.9174 6 17 6V8C19.3869 8 21.6761 8.94821 23.364 10.636L24.7782 9.22183ZM10.3753 8.21913C6.86634 11.0263 4.86605 14.4281 4.50411 18.4095C4.14549 22.3543 5.40799 26.7295 8.13176 31.4961L9.86824 30.5039C7.25868 25.9371 6.18785 21.9791 6.49589 18.5905C6.80061 15.2386 8.46699 12.307 11.6247 9.78087L10.3753 8.21913ZM23.6247 25.7809C27.1294 22.9771 29.1332 19.6127 29.4958 15.6632C29.8549 11.7516 28.5904 7.41119 25.8682 2.64741L24.1318 3.63969C26.7429 8.20923 27.8117 12.1304 27.5042 15.4803C27.2001 18.7924 25.5372 21.6896 22.3753 24.2191L23.6247 25.7809Z" fill="#b70000" />
                            </svg>
                            <h2 className="font-normal text-lg lg:text-2xl leading-6 text-gray-800" style={{ color: "#b70000" }}>eNote</h2>
                        </Link>
                    </div>

                    {/* <ul className="hidden md:flex flex-auto space-x-2">
                        <RenderNavItems />
                    </ul> */}
                    <div className=" flex space-x-5 justify-center items-center pl-2">

                        <svg className="cursor-pointer  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 " width="26" height="26" viewBox="0 0 24 24" id="search"><g data-name="Layer 2">
                            <path d="m20.71 19.29-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z" data-name="search"></path>
                        </g>
                        </svg>
                        <div className="relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ">
                            <svg width="24" height="24" viewBox="0 0 24 24" id="chat" >
                                <path d="M8,11a1,1,0,1,0,1,1A1,1,0,0,0,8,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,12,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,16,11ZM12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.26,6.33l-2,2a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,22h9A10,10,0,0,0,12,2Zm0,18H5.41l.93-.93a1,1,0,0,0,.3-.71,1,1,0,0,0-.3-.7A8,8,0,1,1,12,20Z"></path>
                            </svg>
                            <div className="animate-ping w-1.5 h-1.5 bg-red-700 rounded-full absolute -top-1 -right-1 m-auto duration-200"></div>
                            <div className=" w-1.5 h-1.5 bg-red-700 rounded-full absolute -top-1 -right-1 m-auto shadow-lg"></div>
                        </div>
                        <div className={`w-fit border-l-2 pl-2 border-l-neutral-500 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 `}>
                            {
                                userInfo &&
                                <p onClick={toggleLogoutBadge} className="text-center w-fit px-2 flex flex-row gap-2 items-center text-slate-700">Hi, <strong>{userInfo.f_name} {userInfo.l_name}</strong>
                                <svg className={`${isLogoutBadge ? "rotate-180" : "rotate-0"} transition-all fill-slate-700`} height="12" width="12" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 330 330">
                                    <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
                                    c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
                                    s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"/>
                                </svg>
                            </p>}
                            <div className={`w-fit absolute right-0 -bottom-12 ${isLogoutBadge ? "h-fit opacity-100" : "h-0 opacity-0"} overflow-hidden transition-all `}>
                                <p className={`flex cursor-pointer flex-row gap-2 whitespace-nowrap items-center bg-white bg-opacity-30 border shadow hover:bg-opacity-100 transition-all p-2 rounded-lg`} onClick={() => logout()} >
                                    <span>Log out</span>
                                    <svg width="21" height="21" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M918.857143 763.428571h-80.342857c-5.485714 0-10.628571 2.4-14.057143 6.628572-8 9.714286-16.571429 19.085714-25.6 28a404.388571 404.388571 0 0 1-128.8 86.742857A403.2 403.2 0 0 1 512.457143 916.571429c-54.742857 0-107.771429-10.742857-157.6-31.771429a404.388571 404.388571 0 0 1-128.8-86.742857 403.748571 403.748571 0 0 1-86.857143-128.571429C118.057143 619.657143 107.428571 566.742857 107.428571 512s10.742857-107.657143 31.771429-157.485714c20.342857-48.114286 49.6-91.428571 86.857143-128.571429s80.571429-66.4 128.8-86.742857c49.828571-21.028571 102.857143-31.771429 157.6-31.771429 54.742857 0 107.771429 10.628571 157.6 31.771429 48.228571 20.342857 91.542857 49.6 128.8 86.742857 9.028571 9.028571 17.485714 18.4 25.6 28 3.428571 4.228571 8.685714 6.628571 14.057143 6.628572H918.857143c7.2 0 11.657143-8 7.657143-14.057143C838.857143 110.285714 685.485714 20.114286 511.2 20.571429 237.371429 21.257143 17.828571 243.542857 20.571429 517.028571 23.314286 786.171429 242.514286 1003.428571 512.457143 1003.428571c173.828571 0 326.514286-90.057143 414.057143-225.942857 3.885714-6.057143-0.457143-14.057143-7.657143-14.057143z m101.6-258.628571L858.285714 376.8c-6.057143-4.8-14.857143-0.457143-14.857143 7.2v86.857143H484.571429c-5.028571 0-9.142857 4.114286-9.142858 9.142857v64c0 5.028571 4.114286 9.142857 9.142858 9.142857h358.857142v86.857143c0 7.657143 8.914286 12 14.857143 7.2l162.171429-128a9.142857 9.142857 0 0 0 0-14.4z" /></svg>
                                </p>
                            </div>
                        </div>
                    </div>
                </nav>

            </div>
        </div>

    )
}

export default Header