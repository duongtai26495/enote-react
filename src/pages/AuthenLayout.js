
import React from 'react';
import { Outlet } from 'react-router-dom';
import LangSwitch from '../components/LangSwitch';

function AuthenLayout() {



    return (
        <div className={`min-h-screen flex relative justify-center items-center`}>
            <div className="bg-page w-full h-full absolute top-0 left-0 z-0 bg-cover bg-center bg-gray-100"/>
            <Outlet />
            <LangSwitch page={"authen"} className={`absolute shadow rounded-md bg-white`} />
        </div>
    );
}

export default AuthenLayout;