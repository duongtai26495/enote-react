import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, SORT_ITEMS, SORT_TASK_ITEMS } from '../utils/constants';
import Cookies from 'js-cookie';
import { checkActivateUser, checkToken, fetchApiData } from '../utils/functions';


function Layout() {


  useEffect(() => {
    const getSortItems = async () => {
      const result = await fetchApiData("public/sort_value")
      const result_task = await fetchApiData("public/task/sort_value")
      if (result && result.status !== 403) {
        localStorage.setItem(SORT_ITEMS, JSON.stringify(result))
      }
      if (result_task && result_task.status !== 403) {
        localStorage.setItem(SORT_TASK_ITEMS, JSON.stringify(result_task))
      }
    }
    getSortItems()
    checkLogin()
  }, [])



  const navigate = useNavigate()
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


  return (
    <div className='w-full m-auto relative bg-slate-200 min-h-screen'>
      <div className='absolute w-full top-0 left-0 bg-body'></div>
      <Header className={`sticky top-0 z-50`} />
      <main className='w-full lg:max-w-screen-xl mx-auto px-2 h-full min-height-screen-footer'>
        <div className={`w-full duration-500 delay-200 ease-out transition-all relative flex flex-row`}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;