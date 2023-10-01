
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { EN, LOCALES } from '../utils/constants';

function AuthenLayout() {
    const {t , i18n} = useTranslation()
    const [lang, setLang] = useState(localStorage.getItem("i18nextLng") ?? EN)
    const switchLangHandle = (e) => {
        setLang(e.target.value)
    }

    const updateLang = () => {
        i18n.changeLanguage(lang)
    }

    useEffect(()=>{
        updateLang()
    },[lang])

    const LangSwitch = () => {
        let locales = LOCALES
        return(
            <select className='absolute top-5 right-5 z-50 w-fit bg-white border p-2 font-bold cursor-pointer rounded-md text-sm' name='lang' id='lang'
            value={lang} onChange={(e) => switchLangHandle(e)}>
            {locales?.map((item, index) => {
              return (
                <option key={index} value={item.code}>{item.title}</option>
              );
            })}
    
          </select>
        )
    }

    return (
        <div className="min-h-screen flex relative justify-center items-center">
            <div className="bg-page w-full h-full absolute top-0 left-0 z-0 bg-cover bg-center bg-gray-100"/>
            <LangSwitch />
            <Outlet />
        </div>
    );
}

export default AuthenLayout;