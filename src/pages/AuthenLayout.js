
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SORT_ITEMS, SORT_TASK_ITEMS } from '../utils/constants';
import { fetchApiData } from '../utils/functions';


function AuthenLayout() {


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
        <div className="min-h-screen flex relative justify-center items-center">
            <div className="bg-page w-full h-full absolute top-0 left-0 z-0 bg-cover bg-center bg-gray-100"/>
            <Outlet />
        </div>
    );
}

export default AuthenLayout;