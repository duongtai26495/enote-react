import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import ChatAssist from '../components/ChatAssist';
import { EXPAND_SIDEBAR, HOMEPAGE_ANALYTICS } from '../utils/constants';
import Sidebar from '../components/Sidebar';


function Layout() {

  const [isExpandSidebar, setExpandSidebar] = useState(JSON.parse(localStorage.getItem(EXPAND_SIDEBAR)) ?? true)

  const toggleExpandSidebar = () => setExpandSidebar(prevState => !prevState)

  const handleExpandSidebar = () => {
    toggleExpandSidebar()
  }

  useEffect(() => {
    localStorage.setItem(EXPAND_SIDEBAR, JSON.stringify(isExpandSidebar))
  }, [isExpandSidebar])

  return (
    <div className='w-full m-auto relative bg-slate-50'>
      <div className='absolute w-full top-0 left-0 bg-body'></div>
      <Header />
      <main className='w-full lg:max-w-screen-xl mx-auto px-2 h-full flex flex-col lg:flex-row min-h-screen'>
        <div className={`${isExpandSidebar ? "w-full lg:w-3/4" : "w-full"} duration-500 delay-200 ease-out transition-all relative flex flex-row`}>
          <Outlet /> {/* Hiển thị các thành phần con */}
          <div className='h-full hidden lg:flex flex-col border-r relative justify-center' onClick={() => handleExpandSidebar()}>
              <span className={`bg-red-700 w-fit h-fit py-8 m-auto rounded-l-md transition-all absolute right-0`}>
              <svg className={`fill-white  ${isExpandSidebar ? "rotate-0" : "rotate-180"} transition-all`} 
              height="22"  width="22" id="Layer_1" 
              version="1.1" 
              viewBox="0 0 512 512"><path d="M322.7,128.4L423,233.4c6,5.8,9,13.7,9,22.4c0,8.7-3,16.5-9,22.4L322.7,383.6c-11.9,12.5-31.3,12.5-43.2,0  c-11.9-12.5-11.9-32.7,0-45.2l48.2-50.4h-217C93.7,288,80,273.7,80,256c0-17.7,13.7-32,30.6-32h217l-48.2-50.4  c-11.9-12.5-11.9-32.7,0-45.2C291.4,115.9,310.7,115.9,322.7,128.4z"/></svg>
              </span>
          </div>
        </div>
        <div className={`${isExpandSidebar ? "w-full lg:w-1/4 flex" : "w-full lg:w-0 "} overflow-hidden duration-500 delay-200 ease-out transition-all min-h-full bg-transparent `}>
          <Sidebar type={HOMEPAGE_ANALYTICS} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;