import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({className="w-2/3 lg:w-full"}) => {

    const [searchText, setSearchText] = useState("");

    const navigate = useNavigate()
    const { t } = useTranslation()
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (searchText !== "") {
            navigate(`/search/${searchText}`)
        } else {
            navigate(-1)
        }
    }

    return (
        <div className={`flex ${className} items-center border border-gray-300 rounded-md`} >
            <input
                type="text"
                placeholder={t('common.search')}
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleKeyPress}
                className="px-2 py-1 w-full rounded-l focus:outline-none focus:border-blue-500"
            />
            <button
                onClick={handleSubmit}
                type="submit"
                className=" text-white transition-all px-2 py-1 rounded-r focus:outline-none lg:hover:fill-white lg:hover:bg-blue-600"
            >
                <svg className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 " width="26" height="26" viewBox="0 0 24 24" id="search"><g data-name="Layer 2">
                    <path d="m20.71 19.29-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z" data-name="search"></path>
                </g>
                </svg>
            </button>
        </div>
    )
}

export default SearchBar