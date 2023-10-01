import React, { useState, useEffect } from 'react'
import { EN, LOCALES, VI, ZH } from '../utils/constants'
import { useTranslation } from 'react-i18next'
import vie_lang from '../assets/images/vie_lang.png'
import eng_lang from '../assets/images/eng_lang.png'
import zh_lang from '../assets/images/zh_lang.png'
const LangSwitch = ({ className }) => {
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
        <div className={`min-w-fit w-12 top-5 bg-white z-50 ${className}`} onClick={toggleOpen}>
            <p className='cursor-pointer items-center w-full flex-nowrap gap-0 lg:gap-2  lg:p-2 lg:border justify-center flex text-sm rounded-md font-bold'>
                <img src={setFlag(lang)} alt={selectedLang} className='w-8 h-8 object-contain' />
                <span className='hidden lg:block'>
                    {selectedLang}
                </span>
            </p>
            <div className={`relative w-full h-fit ${isOpen ? "flex" : "hidden"}`}>
                <div className={`absolute border rounded-md right-0 flex-col gap-2 w-fit h-fit max-h-fit bg-white p-3 text-sm`}>
                    {locales?.map((item, index) => {
                        return (
                            <p className='w-28 flex top-0 left-0 gap-2 py-2 items-center cursor-pointer whitespace-nowrap text-sm' key={index} onClick={() => { switchLangHandle(item) }}>
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