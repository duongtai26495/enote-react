import { checkActivateUser, checkToken, loadNavigationItem, logoutAccount } from "../utils/functions"
import { useEffect, useRef, useState } from "react"
import Cookies from "js-cookie"

import { Link, useNavigate, useRoutes } from "react-router-dom"
import LoadingComponent from "./LoadingComponent"
import { ACCESS_TOKEN, LOCAL_USER, URL_PREFIX } from "../utils/constants"
import CustomLazyLoadedImage from "./CustomLazyLoadedImage"
import { el } from "date-fns/locale"



const Header = ({ className }) => {
    const [searchText, setSearchText] = useState("");
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


    useEffect(() => {
        function handleClickOutside(event) {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
                setLogoutBadge(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const userInfo = JSON.parse(localStorage.getItem(LOCAL_USER))
    let profileImage = ""

    if (userInfo && userInfo.profile_image) {
        profileImage = `${URL_PREFIX}public/image/${userInfo.profile_image}`
    } else {
        profileImage = "https://source.unsplash.com/random"
    }


    const toggleLogoutBadge = () => setLogoutBadge(preState => !preState)

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (searchText !== "") {
            navigate(`/search/${searchText}`)
        } else {
            navigate(-1)
        }
    }

    const returnHomePage = () => {
        setSearchText("")
        navigate("/")
    }

    return (
        <div className={`mx-auto w-full bg-white border-b ${className}`}>
            <div className="p-3 w-full lg:max-w-screen-xl mx-auto">
                <nav className="flex flex-col lg:flex-row justify-between gap-5 lg:gap-0 relative">
                    <div className="lg:pr-16 pr-0 mx-auto lg:mx-0">
                        <button className="flex items-center justify-center space-x-2 flex-row " onClick={() => { returnHomePage() }}>
                            <svg className="w-12 h-12 fill-teal-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 898.63 772.08">
                                <g id="Layer_2">
                                    <g id="Layer_1-2">
                                        <path className="space-logo" d="M432.16,0V42.29L36.64,279.88v492.2H0V261.24a4.39,4.39,0,0,1,2.18-3.77Z" />
                                        <path className="space-logo" d="M453.38,569.26a38.4,38.4,0,0,1-4.06-.22V488.62a35.91,35.91,0,0,1,4.06-.22A32.81,32.81,0,0,1,472,493.71a35.87,35.87,0,0,1,12.42,14.48A46.71,46.71,0,0,1,488.86,529a46.06,46.06,0,0,1-4.47,20.52A35.68,35.68,0,0,1,472,564,32.73,32.73,0,0,1,453.38,569.26Z" />
                                        <path className="space-logo" d="M754.72,500.47a32.24,32.24,0,0,0-11.1-8.8,31.66,31.66,0,0,0-14.11-3.27A46,46,0,0,0,716,490.33a25.89,25.89,0,0,0-10.86,6.52,31.36,31.36,0,0,0-7.24,12.31,36.78,36.78,0,0,0-1.45,5.55h63.24V513A22.24,22.24,0,0,0,754.72,500.47Zm0,0a32.24,32.24,0,0,0-11.1-8.8,31.66,31.66,0,0,0-14.11-3.27A46,46,0,0,0,716,490.33a25.89,25.89,0,0,0-10.86,6.52,31.36,31.36,0,0,0-7.24,12.31,36.78,36.78,0,0,0-1.45,5.55h63.24V513A22.24,22.24,0,0,0,754.72,500.47Zm141.74-243L449.32,0V461.87A55.56,55.56,0,0,1,467.87,465a57.17,57.17,0,0,1,15.07,8,61.43,61.43,0,0,1,4.72,3.94v-.32a14.4,14.4,0,0,1,4.1-10.49,13.82,13.82,0,0,1,10.38-4.23,14.12,14.12,0,0,1,10.38,4.1,14.42,14.42,0,0,1,4.1,10.62v102.1a14.5,14.5,0,0,1-4.1,10.51,14.9,14.9,0,0,1-20.76,0A14.25,14.25,0,0,1,487.68,579a52.45,52.45,0,0,1-7.26,6.48,56.47,56.47,0,0,1-13.65,7.37,47,47,0,0,1-17,3h-.44V772.08H898.63V261.24A4.4,4.4,0,0,0,896.46,257.47ZM645.75,584.84q-6.76,4.92-17.75,8a89.41,89.41,0,0,1-23.76,3q-19.08,0-33.07-8.8a59,59,0,0,1-21.61-24,75,75,0,0,1-7.6-34q0-19.77,8.08-34.87a59.81,59.81,0,0,1,22.45-23.65q14.37-8.58,33-8.58a88.74,88.74,0,0,1,24,2.9q10.24,2.89,15.93,8.09a16.21,16.21,0,0,1,5.68,12.42,15.72,15.72,0,0,1-2.89,9.06,9.64,9.64,0,0,1-8.45,4.22,15.1,15.1,0,0,1-10.86-3.86,26.35,26.35,0,0,0-4.59-3.14,21.94,21.94,0,0,0-7.37-2.29,48,48,0,0,0-7.35-.85q-12.31,0-20.89,5.31a35.39,35.39,0,0,0-13.15,14.37A45.54,45.54,0,0,0,570.93,529a44.13,44.13,0,0,0,4.7,20.65,36.72,36.72,0,0,0,13,14.35,35,35,0,0,0,19.2,5.31,63.42,63.42,0,0,0,10.38-.73,25.55,25.55,0,0,0,7.24-2.17,44.43,44.43,0,0,0,6-4.1c1.77-1.45,4.42-2.17,8-2.17q6.25,0,9.65,4a14.56,14.56,0,0,1,3.38,9.76Q652.51,579.89,645.75,584.84ZM786,535.23a15.39,15.39,0,0,1-10.14,3.62H696.18a36.54,36.54,0,0,0,4.47,11.95,37.09,37.09,0,0,0,32.24,18.46,56,56,0,0,0,14.24-1.45,33.11,33.11,0,0,0,8.56-3.49q3.25-2.05,5.92-3.51a18.32,18.32,0,0,1,8.2-2.17,12.17,12.17,0,0,1,12.31,12.07c0,4.34-2.26,8.3-6.75,11.82q-6.3,5.33-17.61,9.3a70.87,70.87,0,0,1-23.53,4q-20.46,0-35.51-8.56A59.19,59.19,0,0,1,675.55,564q-8.07-14.72-8.07-33.31,0-21.72,8.8-37a62,62,0,0,1,23.06-23.54,59.57,59.57,0,0,1,30.17-8.21,54.87,54.87,0,0,1,23.28,5.07,63.84,63.84,0,0,1,19.44,13.89,67.48,67.48,0,0,1,13.38,20.38,61.86,61.86,0,0,1,5,24.62A12.47,12.47,0,0,1,786,535.23Zm-42.37-43.56a31.66,31.66,0,0,0-14.11-3.27A46,46,0,0,0,716,490.33a25.89,25.89,0,0,0-10.86,6.52,31.36,31.36,0,0,0-7.24,12.31,36.78,36.78,0,0,0-1.45,5.55h63.24V513a22.24,22.24,0,0,0-5-12.55A32.24,32.24,0,0,0,743.62,491.67Zm11.1,8.8a32.24,32.24,0,0,0-11.1-8.8,31.66,31.66,0,0,0-14.11-3.27A46,46,0,0,0,716,490.33a25.89,25.89,0,0,0-10.86,6.52,31.36,31.36,0,0,0-7.24,12.31,36.78,36.78,0,0,0-1.45,5.55h63.24V513A22.24,22.24,0,0,0,754.72,500.47Zm0,0a32.24,32.24,0,0,0-11.1-8.8,31.66,31.66,0,0,0-14.11-3.27A46,46,0,0,0,716,490.33a25.89,25.89,0,0,0-10.86,6.52,31.36,31.36,0,0,0-7.24,12.31,36.78,36.78,0,0,0-1.45,5.55h63.24V513A22.24,22.24,0,0,0,754.72,500.47Z" />
                                        <path className="space-logo" d="M215.88,524.49A35.15,35.15,0,0,0,205,510.25,59.54,59.54,0,0,0,186.8,501a196.15,196.15,0,0,0-25.47-6.27,144,144,0,0,1-19.07-4.94q-8-2.79-12.18-7.49a17.2,17.2,0,0,1-4.23-11.95,16.7,16.7,0,0,1,3.62-10.62q3.61-4.57,10.75-7.24t17.49-2.66a49.75,49.75,0,0,1,13.52,2.06A91.3,91.3,0,0,1,185,456.91a43.64,43.64,0,0,1,10.38,6.39,10.59,10.59,0,0,0,6.52,2.17,12.88,12.88,0,0,0,9.65-4.34,13.78,13.78,0,0,0,4.11-9.66c0-4.83-2.34-9.08-7-12.79q-8.44-7.24-21.84-11.94A87.17,87.17,0,0,0,157.71,422a77.64,77.64,0,0,0-30.41,5.8,50.71,50.71,0,0,0-21.84,16.89q-8.1,11.12-8.09,26.79a49.44,49.44,0,0,0,3.38,18.72,39.85,39.85,0,0,0,10,14.48,53.42,53.42,0,0,0,16.53,10.14,101.06,101.06,0,0,0,22.93,5.9q13.76,1.95,22.69,5.44c6,2.32,10.37,5.18,13.27,8.56a18.25,18.25,0,0,1,4.35,12.31A15,15,0,0,1,186,557.8a32,32,0,0,1-12.07,7.48,47.06,47.06,0,0,1-16.41,2.77c-8.86,0-16.28-1.28-22.32-3.86a76,76,0,0,1-18.23-11.35,12.78,12.78,0,0,0-8.21-2.89,13.16,13.16,0,0,0-10,4.23,13.83,13.83,0,0,0-4,9.77,14.93,14.93,0,0,0,1.69,6.76,18.93,18.93,0,0,0,4.83,6,72.84,72.84,0,0,0,25.83,14.85,101.88,101.88,0,0,0,30.41,4.22,76.82,76.82,0,0,0,30.54-6,55.42,55.42,0,0,0,22.8-17.37q8.69-11.34,8.69-27Q219.5,533.06,215.88,524.49Z" />
                                        <path className="space-logo" d="M363.22,494A60.58,60.58,0,0,0,342,470.43a55,55,0,0,0-30.28-8.58,44.75,44.75,0,0,0-16.06,2.9,51.91,51.91,0,0,0-13.39,7.37,50.36,50.36,0,0,0-8.44,8V479a14.46,14.46,0,0,0-4.11-10.49,14.81,14.81,0,0,0-20.75,0A14.46,14.46,0,0,0,244.84,479v148A14.36,14.36,0,0,0,249,637.56a14.05,14.05,0,0,0,10.37,4.11,13.89,13.89,0,0,0,10.38-4.22,14.54,14.54,0,0,0,4.11-10.51V579.6a53.84,53.84,0,0,0,5.9,5.11,57.24,57.24,0,0,0,14.85,8,51.37,51.37,0,0,0,18.11,3.14,53,53,0,0,0,29.55-8.56,61.15,61.15,0,0,0,21-23.65q7.86-15.11,7.86-34.89T363.22,494Zm-24.37,55.4A36,36,0,0,1,326.54,564a32.13,32.13,0,0,1-18.46,5.31A32.68,32.68,0,0,1,289.5,564a35.77,35.77,0,0,1-12.44-14.6,47.13,47.13,0,0,1-4.46-20.64,46.07,46.07,0,0,1,4.46-20.63,36.28,36.28,0,0,1,12.44-14.37,32.76,32.76,0,0,1,18.58-5.31,32.21,32.21,0,0,1,18.46,5.31,36.54,36.54,0,0,1,12.31,14.37,45.94,45.94,0,0,1,4.47,20.63A47,47,0,0,1,338.85,549.35Z" />
                                        <path className="space-logo" d="M435,493.71a31.42,31.42,0,0,1,14.28-5.09V461.87a4.61,4.61,0,0,0-.52,0,53.08,53.08,0,0,0-29.45,8.58,60.85,60.85,0,0,0-21.13,23.65q-7.83,15.07-7.83,34.87,0,19.54,7.83,34.65a60.46,60.46,0,0,0,21.37,23.65,55.23,55.23,0,0,0,29.73,8.56V569A31.19,31.19,0,0,1,435,564a35.87,35.87,0,0,1-12.44-14.48A46.32,46.32,0,0,1,418.14,529a47,47,0,0,1,4.46-20.76A36.07,36.07,0,0,1,435,493.71Z" />
                                    </g>
                                </g>
                            </svg>
                            {/* <h2 className="text-lg lg:text-2xl font-bold leading-6 text-gray-800" style={{ color: "#b70000" }}>Space</h2> */}
                        </button>
                    </div>
                    <div className="flex justify-between gap-2 lg:justify-center items-center pl-2">

                        <div className="w-fit gap-3 flex flex-row-reverse items-center justify-end lg:flex-row">

                            <div className="flex w-full items-center border border-gray-300 rounded-md" >
                                <input
                                    type="text"
                                    placeholder="Search note..."
                                    value={searchText}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyPress}
                                    className="px-2 py-1 w-full rounded-l focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className=" text-white transition-all px-2 py-1 rounded-r focus:outline-none lg:hover:fill-white lg:hover:bg-blue-600"
                                >
                                    <svg className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 " width="26" height="26" viewBox="0 0 24 24" id="search"><g data-name="Layer 2">
                                        <path d="m20.71 19.29-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z" data-name="search"></path>
                                    </g>
                                    </svg>
                                </button>
                            </div>
                            <Link to={"/chat-ai"} className="relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ">
                                <svg width="24" height="24" viewBox="0 0 24 24" id="chat" >
                                    <path d="M8,11a1,1,0,1,0,1,1A1,1,0,0,0,8,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,12,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,16,11ZM12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.26,6.33l-2,2a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,22h9A10,10,0,0,0,12,2Zm0,18H5.41l.93-.93a1,1,0,0,0,.3-.71,1,1,0,0,0-.3-.7A8,8,0,1,1,12,20Z"></path>
                                </svg>
                                <div className="animate-ping w-1.5 h-1.5 bg-red-700 rounded-full absolute -top-1 -right-1 m-auto duration-200"></div>
                                <div className=" w-1.5 h-1.5 bg-red-700 rounded-full absolute -top-1 -right-1 m-auto shadow-lg"></div>
                            </Link>
                        </div>
                        <div className={`w-fit relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 `}>
                            {
                                userInfo &&
                                <p onClick={toggleLogoutBadge} className="text-center w-full whitespace-nowrap justify-end px-2 flex flex-row gap-2 items-center text-slate-700">
                                    <CustomLazyLoadedImage
                                        className={`aspect-square object-cover rounded-full w-6 h-6`}
                                        src={`${profileImage}`}
                                    />
                                    <span className="hidden lg:block">
                                        <strong>{userInfo.f_name} {userInfo.l_name}</strong>
                                    </span>
                                    <svg className={`${isLogoutBadge ? "rotate-180" : "rotate-0"} transition-all fill-slate-700 h-3 w-3`} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 330 330">
                                        <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
                                    c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
                                    s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"/>
                                    </svg>
                                </p>}
                            <div
                                ref={accountMenuRef}
                                className={`w-fit border gap-2 flex flex-col px-4 py-2 absolute z-20 right-0 top-10 ${isLogoutBadge ? "h-fit opacity-100" : "h-0 opacity-0"} overflow-hidden transition-all bg-white rounded-lg`}>
                                <p className="flex cursor-pointer flex-row gap-2 whitespace-nowrap justify-between items-center bg-white rounded-sm lg:hover:shadow-lg shadow transition-all p-2 " onClick={() => { profileDirect() }}>
                                    <span className="text-sm">Profile</span>
                                    <svg width="21" height="21" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="info" /><g id="icons"><g id="user"><ellipse cx="12" cy="8" rx="5" ry="6" /><path d="M21.8,19.1c-0.9-1.8-2.6-3.3-4.8-4.2c-0.6-0.2-1.3-0.2-1.8,0.1c-1,0.6-2,0.9-3.2,0.9s-2.2-0.3-3.2-0.9    C8.3,14.8,7.6,14.7,7,15c-2.2,0.9-3.9,2.4-4.8,4.2C1.5,20.5,2.6,22,4.1,22h15.8C21.4,22,22.5,20.5,21.8,19.1z" /></g></g></svg>
                                </p>
                                <p className={`flex cursor-pointer flex-row gap-2 whitespace-nowrap justify-between items-center bg-white rounded-sm lg:hover:shadow-lg shadow transition-all p-2 `}
                                    onClick={() => logout()} >
                                    {
                                        isLogout
                                            ?
                                            <LoadingComponent size={`w-5 h-5`} className={`flex w-full`} />
                                            :
                                            <>
                                                <span className="text-sm">Log out</span>
                                                <svg width="21" height="21" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M918.857143 763.428571h-80.342857c-5.485714 0-10.628571 2.4-14.057143 6.628572-8 9.714286-16.571429 19.085714-25.6 28a404.388571 404.388571 0 0 1-128.8 86.742857A403.2 403.2 0 0 1 512.457143 916.571429c-54.742857 0-107.771429-10.742857-157.6-31.771429a404.388571 404.388571 0 0 1-128.8-86.742857 403.748571 403.748571 0 0 1-86.857143-128.571429C118.057143 619.657143 107.428571 566.742857 107.428571 512s10.742857-107.657143 31.771429-157.485714c20.342857-48.114286 49.6-91.428571 86.857143-128.571429s80.571429-66.4 128.8-86.742857c49.828571-21.028571 102.857143-31.771429 157.6-31.771429 54.742857 0 107.771429 10.628571 157.6 31.771429 48.228571 20.342857 91.542857 49.6 128.8 86.742857 9.028571 9.028571 17.485714 18.4 25.6 28 3.428571 4.228571 8.685714 6.628571 14.057143 6.628572H918.857143c7.2 0 11.657143-8 7.657143-14.057143C838.857143 110.285714 685.485714 20.114286 511.2 20.571429 237.371429 21.257143 17.828571 243.542857 20.571429 517.028571 23.314286 786.171429 242.514286 1003.428571 512.457143 1003.428571c173.828571 0 326.514286-90.057143 414.057143-225.942857 3.885714-6.057143-0.457143-14.057143-7.657143-14.057143z m101.6-258.628571L858.285714 376.8c-6.057143-4.8-14.857143-0.457143-14.857143 7.2v86.857143H484.571429c-5.028571 0-9.142857 4.114286-9.142858 9.142857v64c0 5.028571 4.114286 9.142857 9.142858 9.142857h358.857142v86.857143c0 7.657143 8.914286 12 14.857143 7.2l162.171429-128a9.142857 9.142857 0 0 0 0-14.4z" /></svg>
                                            </>
                                    }
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