import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { ACCESS_TOKEN } from '../utils/constants';
import { checkToken, fetchApiData } from '../utils/functions';
import Cookies from 'js-cookie';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import NoteItem from '../components/NoteItem';
import EmptyList from '../components/EmptyList';
const SearchResult = () => {

    const navigate = useNavigate();
    let { name } = useParams();
    const token = Cookies.get(ACCESS_TOKEN)
    const [resultList, setResultList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const firstPage = 1

    useEffect(() => {
        const getSearchResult = async () => {
            if (checkToken(token) && name !== "") {
                const result = await fetchApiData(`note/search?name=${name}`, token)
                console.log(result)
                setResultList(result.content)
            } else {
                navigate("/login?unlogin=true")
            }
        }
        getSearchResult()
        document.title = `Search - ${name}`
    }, [name])



    const setPage = (TYPE) => {
        switch (TYPE) {
            case "PREV":
                if (currentPage > 1) {
                    let current = Number(currentPage) - 1
                    setCurrentPage(current)
                    localStorage.setItem("currentPage", current)
                }
                break;
            case "NEXT":
                if (currentPage < maxPage) {
                    let current = Number(currentPage) + 1
                    setCurrentPage(current)
                    localStorage.setItem("currentPage", current)
                }
                break;
        }
    }

    const Pagination = () => {
        return (
            <div className='w-1/3 lg:w-full flex flex-row justify-end'>
                <p className='text-sm w-full lg:w-1/5 text-center flex flex-row items-center justify-between'>
                    <span className={`cursor-pointer pagingation-num transition-all ${currentPage === firstPage && 'fill-slate-200'}`} onClick={() => setPage("PREV")}>
                        <svg className='rotate-180' height="20" id="Layer_1" viewBox="0 0 200 200" width="20" xmlns="http://www.w3.org/2000/svg"><title /><path d="M132.72,78.75l-56.5-56.5a9.67,9.67,0,0,0-14,0,9.67,9.67,0,0,0,0,14l56.5,56.5a9.67,9.67,0,0,1,0,14l-57,57a9.9,9.9,0,0,0,14,14l56.5-56.5C144.22,109.25,144.22,90.25,132.72,78.75Z" /></svg>
                    </span>

                    <span className={`w-5 h-5 pagingation-num text-center cursor-pointer transition-all ${currentPage === 1 ? "page-active" : 'pagingation-num '}`} onClick={() => setCurrentPage(1)}>1</span>

                    <span className={`${maxPage > 2 ? "flex" : "hidden"} transition-all w-5 h-5 pagingation-num text-center cursor-pointer ${currentPage === firstPage + 1 && "page-active"}`}
                        onClick={() => setPage("NEXT")}>{firstPage + 1}</span>

                    <span className={`${maxPage > 5 ? "flex" : "hidden"} `}>...</span>

                    <span className={`${maxPage > 3 ? "flex" : "hidden"} transition-all w-5 h-5 pagingation-num text-center cursor-pointer ${currentPage === maxPage - 1 && "page-active"}`}
                        onClick={() => setCurrentPage(maxPage - 1)}>{maxPage - 1}</span>

                    <span className={`w-5 h-5 pagingation-num text-center cursor-pointer transition-all ${firstPage === maxPage && "hidden"} ${currentPage === maxPage && "page-active"}`} onClick={() => setCurrentPage(maxPage)}>{maxPage}</span>

                    <span className={`cursor-pointer transition-all  ${currentPage === maxPage ? 'fill-slate-200' : 'pagingation-num '}`} onClick={() => setPage("NEXT")}>
                        <svg className='' height="20" id="Layer_1" viewBox="0 0 200 200" width="20" xmlns="http://www.w3.org/2000/svg"><title /><path d="M132.72,78.75l-56.5-56.5a9.67,9.67,0,0,0-14,0,9.67,9.67,0,0,0,0,14l56.5,56.5a9.67,9.67,0,0,1,0,14l-57,57a9.9,9.9,0,0,0,14,14l56.5-56.5C144.22,109.25,144.22,90.25,132.72,78.75Z" /></svg>
                    </span>
                </p>
            </div>
        )
    }

    const RenderNote = React.memo(() => {
        return (
            <ResponsiveMasonry className='min-h-screen masonry-wrapper' columnsCountBreakPoints={{ 350: 2, 767: 3, 960: 3 }}>
                <Masonry>
                    {
                        resultList?.map((item, index) => (
                            <NoteItem note={item} key={item.id} subclass={``} />
                        ))
                    }
                </Masonry>
            </ResponsiveMasonry>
        )
    })
    return (
        <div className='w-full'>
            <div className='flex flex-row justify-between bg-slate-300'>

                <Breadcrumbs text={"Back to previous"} localtion={-1} />

                <Pagination />
            </div>
            {
                resultList.length > 0 ?
                    <RenderNote />
                    :
                    <EmptyList />
            }

        </div>
    )
}

export default SearchResult