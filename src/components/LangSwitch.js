import React, { useState, useEffect } from 'react'
import { EN, LOCALES, VI, ZH } from '../utils/constants'
import { useTranslation } from 'react-i18next'
import vie_lang from '../assets/images/vie_lang.png'
import eng_lang from '../assets/images/eng_lang.png'
import zh_lang from '../assets/images/zh_lang.png'
const LangSwitch = ({ className, page }) => {
    const { t, i18n } = useTranslation()
    const [lang, setLang] = useState(localStorage.getItem("i18nextLng") ?? EN)
    const [selectedLang, setSelectedLang] = useState()
    const [isOpen, setOpen] = useState(false)
    let locales = LOCALES

    const switchLangHandle = (e) => {
        setLang(e.code)
        setSelectedLang(e.title)
    }

    const updateLang = () => {
        i18n.changeLanguage(lang)
        let selected = locales.filter(item => item.code === lang)
        setSelectedLang(selected[0].title)
    }

    const toggleOpen = () => {
        setOpen(prevState => !prevState)
    }

    useEffect(() => {
        updateLang()

    }, [lang])

    const setFlag = (lang) => {

        switch (lang) {
            case EN: return eng_lang
            case ZH: return zh_lang
            default: return vie_lang
        }

    }

    // return(
    //     <select className={`${className}  top-5 right-5 z-50 w-fit bg-white border p-2 font-bold cursor-pointer rounded-md text-sm`} name='lang' id='lang'
    //     value={lang} onChange={(e) => switchLangHandle(e)}>
    //     {locales?.map((item, index) => {
    //       return (
    //         <option key={index} value={item.code}>
    //         {item.title}
    //         </option>
    //       );
    //     })}

    //   </select>
    // )

    return (
        <div className={`min-w-fit w-fit bottom-5 right-5  z-40 ${className}`} onClick={toggleOpen}>
            <p className='cursor-pointer items-center w-full flex-nowrap gap-0 lg:gap-2 p-2 lg:border justify-center flex text-sm rounded-md font-bold'>
                <img src={setFlag(lang)} alt={selectedLang} className='w-5 h-5 object-contain' />
                <span className={`${page !== "authen" ? "hidden lg:block" : "block"}`}>
                    {selectedLang}
                </span>
            </p>
            <div className={`relative w-full h-fit ${isOpen ? "flex" : "hidden"}`}>
                <div className={`absolute border rounded-md right-0 bottom-10 lg:bottom-10 items-center flex-col flex w-fit h-fit max-h-fit bg-white text-sm`}>
                    {locales?.map((item, index) => {
                        return (
                            <p className={`w-32 flex top-0 left-0 gap-2 lg:hover:bg-slate-100 p-3 text-black ${lang === item.code ? "bg-slate-300" : ""} mx-auto items-center cursor-pointer whitespace-nowrap text-sm`} 
                            key={index} 
                            onClick={() => { switchLangHandle(item) }}>
                                <img src={setFlag(item.code)} alt={item.title} className='w-5 h-5' />
                                <span className='w-fit flex-1'>
                                    {item.title}
                                </span>
                            </p>
                        );
                    })}
                </div>
            </div>
        </div>
    )

}

export default LangSwitch