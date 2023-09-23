import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import {SORT_ITEMS, SORT_TASK_ITEMS } from '../utils/constants';
import { fetchApiData } from '../utils/functions';


function Layout() {


  useEffect(() => {
    const getSortItems = async () => {
            const result = await fetchApiData("public/sort_value")
            const result_task = await fetchApiData("public/task/sort_value")
            if (result && result.status !== 403) {
                if (result.length > 0) {
                    localStorage.setItem(SORT_ITEMS, JSON.stringify(result))
                }
            }
            if (result_task && result_task.status !== 403) {
                if (result_task.length > 0) {
                    localStorage.setItem(SORT_TASK_ITEMS, JSON.stringify(result_task))
                }
            }
    }
    getSortItems()
}, [])


  return (
    <div className='w-full m-auto relative bg-slate-200'>
      <div className='absolute w-full top-0 left-0 bg-body'></div>
      <Header />
      <main className='w-full lg:max-w-screen-xl mx-auto px-2 h-full flex flex-col lg:flex-row min-h-screen'>
        <div className={`w-full duration-500 delay-200 ease-out transition-all relative flex flex-row`}>
          <Outlet />
        </div>
     
      </main>
      <Footer />
    </div>
  );
}

export default Layout;