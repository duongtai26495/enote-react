import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';


function Layout() {
  return (
    <div className='w-full m-auto relative bg-slate-200 content-wrapper'>
      <div className='absolute w-full top-0 left-0 bg-body'></div>
      <Header className={`lg:sticky top-0 z-50`} />
      <main className='w-full lg:max-w-screen-xl mx-auto px-2 min-h-screen h-full flex flex-col lg:flex-row'>
        <div className={`w-full duration-500 delay-200 ease-out transition-all relative flex flex-row`}>
          <Outlet />
        </div>
     
      </main>
      <Footer />
    </div>
  );
}

export default Layout;