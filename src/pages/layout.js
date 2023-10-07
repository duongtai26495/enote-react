import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, PRIMARY_WS } from '../utils/constants';
import Cookies from 'js-cookie';
import { checkActivateUser, checkToken, fetchApiData } from '../utils/functions';
import SearchBar from '../components/SearchBar';
import NavigationMenu from '../components/NavigationMenu';


function Layout() {

  useEffect(() => {

    checkLogin()
  }, [])

  const navigate = useNavigate()
  const [isOpen, setOpen] = useState(false) 

  const checkLogin = async () => {
    const token = Cookies.get(ACCESS_TOKEN)
    if (checkToken(token)) {
      let isActivated = await checkActivateUser(token)
      if (!isActivated) {
        navigate("/activate-account")
      } 
    } else {
      navigate("/login?unlogin")
    }
  }

  const toggleOpenMenu = () => setOpen(prevState => !prevState)


  return (
    <div className='w-full m-auto relative bg-zinc-100 min-h-screen background-blur'>
      <div className='absolute w-full top-0 left-0 bg-body'></div>
      <Header className={`top-0 z-50`} toggleOpenMenu={toggleOpenMenu} isOpen={isOpen} />
      <main className='w-full lg:max-w-screen-xl mx-auto px-2 h-full min-height-screen-footer '>
        <div className={`w-full duration-500 delay-200 ease-out transition-all relative flex flex-row`}>
          <Outlet />
        </div>
      </main>
      <Footer />
      <div className={`w-full absolute top-16  ${isOpen ? "menu-open" :"menu-closed"} block lg:hidden  mobile-menu-wrapper`}>
      <div className='w-3/4 h-full pt-5 bg-white px-2'>
        <SearchBar className={`w-full`} />
        <NavigationMenu />
      </div>
      </div>
    </div>
  );
}

export default Layout;