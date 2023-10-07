import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const NavigationMenu = () => {
    const { t } = useTranslation()
    return (
        <div className="relative mt-5 lg:mt-0 w-full lg:w-1/3 gap-3 flex items-center justify-start ">
            <ul className="flex lg:gap-2 flex-col lg:flex-row  w-full">
                <li className="text-sm h-fit w-full lg:w-fit">
                    <Link className="p-5 lg:p-2 border-b lg:border w-full lg:w-fit block rounded-md lg:hover:shadow-md transition-all" to={"/"}>{t('common.home')}</Link></li>

                <li className="text-sm h-fit w-full lg:w-fit">
                    <Link className="p-5 lg:p-2 border-b lg:border w-full lg:w-fit block rounded-md lg:hover:shadow-md transition-all " to={"/dashboard"}>{t('common.all_workspace')}</Link></li>
            </ul>
        </div>
    )
}

export default NavigationMenu