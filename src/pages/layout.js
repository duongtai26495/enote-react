import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';


function Layout() {
  return (
    <div className='w-full'>
      <div className='absolute w-full h-full top-0 left-0 bg-body'></div>
    <Header />
    <main className='px-2 '>
      <Outlet /> {/* Hiển thị các thành phần con */}
    </main>
    <Footer />
  </div>
  );
}

export default Layout;