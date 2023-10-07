
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import SearchBar from "./SearchBar"
import ProfileHeader from "./ProfileHeader"
import LogoHeader from "./LogoHeader"
import NavigationMenu from "./NavigationMenu"



const Header = ({ className, toggleOpenMenu = () => { }, isOpen }) => {
    const navigate = useNavigate()



    const returnHomePage = () => {
        navigate("/")
    }

    return (
        <div className={`mx-auto w-full bg-white border-b ${className}`}>
            <div className="py-3 w-full lg:max-w-screen-xl mx-auto desktop-nav hidden lg:block">
                <nav className="flex flex-row justify-start relative gap-2">
                    <div className="w-1/3">

                        <LogoHeader />
                    </div>
                    <NavigationMenu />

                    <div className="flex w-full lg:w-2/3 px-3 lg:px-0 justify-between gap-2 lg:justify-center items-center ">
                        <SearchBar />
                        <div className={`w-1/3 lg:w-full justify-end flex items-center gap-0 lg:gap-3 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 `}>

                            <Link to={"/chat-ai"} className="relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ">
                                <svg width="24" height="24" viewBox="0 0 24 24" id="chat" >
                                    <path d="M8,11a1,1,0,1,0,1,1A1,1,0,0,0,8,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,12,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,16,11ZM12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.26,6.33l-2,2a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,22h9A10,10,0,0,0,12,2Zm0,18H5.41l.93-.93a1,1,0,0,0,.3-.71,1,1,0,0,0-.3-.7A8,8,0,1,1,12,20Z"></path>
                                </svg>
                                <div className="animate-ping w-1.5 h-1.5 bg-red-700 rounded-full absolute -top-1 -right-1 m-auto duration-200"></div>
                                <div className=" w-1.5 h-1.5 bg-red-700 rounded-full absolute -top-1 -right-1 m-auto shadow-lg"></div>
                            </Link>
                            <ProfileHeader />
                        </div>
                    </div>
                </nav>
            </div>

            <div className="py-3 w-full lg:max-w-screen-xl mx-auto desktop-nav block lg:hidden mobile-nav">
                <div className="flex items-center px-2">
                    <button className="menu-hambur p-1 w-1/3" onClick={() => toggleOpenMenu()}>
                        <svg className={`w-6 h-6 ${isOpen ? "openHambur" : ""}`} dataname="Layer 1" id="Layer_1" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                            <path className="first-stick" d="M50,12.5H2a2,2,0,0,1,0-4H50a2,2,0,0,1,0,4Z" />
                            <path className="second-stick" d="M50,28H2a2,2,0,0,1,0-4H50a2,2,0,0,1,0,4Z" />
                            <path className="last-stick" d="M50,43.5H2a2,2,0,0,1,0-4H50a2,2,0,0,1,0,4Z" />
                        </svg>
                    </button>
                    <div className="mx-auto  w-1/3 flex justify-center items-center">
                        <LogoHeader />
                    </div>
                    <div className="w-1/3 flex justify-end items-center">
                        <ProfileHeader />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Header