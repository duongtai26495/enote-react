import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { ACCESS_TOKEN } from '../utils/constants';
import { checkToken, fetchApiData } from '../utils/functions';
import Cookies from 'js-cookie';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import NoteItem from '../components/NoteItem';
import EmptyList from '../components/EmptyList';
import Pagination from '../components/Pagination';
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
                let page = currentPage - 1
                const result = await fetchApiData(`note/search?name=${name}&page=${page}`, token)
                console.log(result)
                setMaxPage(result.totalPages)
                setResultList(result.content)
            } else {
                navigate("/login?unlogin=true")
            }
        }
        getSearchResult()
        document.title = `Search - ${name}`
    }, [name, currentPage])



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


    const RenderNote = React.memo(() => {
        return (
            <ResponsiveMasonry className='masonry-wrapper' columnsCountBreakPoints={{ 350: 2, 767: 3, 960: 3 }}>
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

                <Pagination
                    className={'justify-end'}
                    currentPage={currentPage}
                    maxPage={maxPage}
                    firstPage={firstPage}
                    setCurrentPage={setCurrentPage}
                    setPage={setPage}
                />
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