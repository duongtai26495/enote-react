import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import ChatAssist from '../components/ChatAssist';


function Layout() {
  return (
    <div className='w-full lg:container  m-auto relative'>
      <div className='absolute w-full top-0 left-0 bg-body'></div>
      <Header />
      <main className='w-full  px-2 h-full flex flex-row min-h-screen'>
        <Outlet/> {/* Hiển thị các thành phần con */}
        {/* <div className='w-1/3 min-h-full hidden lg:flex bg-transparent border p-3'>
          <ChatAssist />
        </div> */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;