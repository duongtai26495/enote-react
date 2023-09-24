import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { ACCESS_TOKEN, CURRENT_WS, WS_SELECTED_SORT, SORT_ITEMS, SUCCESS_RESULT } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'

import LoadingComponent from '../components/LoadingComponent'
import WorkspaceCard from '../components/WorkspaceCard'
const Home = () => {

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setLoading] = useState(true)
  const [noteCount, setNoteCount] = useState(0)
  const [wsList, setWsList] = useState([])
  const [selectedWs, setSelectedWs] = useState(localStorage.getItem(CURRENT_WS))
  const [addNoteState, setAddNoteState] = useState(false)
  const [isLoadingAdd, setLoadingAdd] = useState(false)
  const [sortValues, setSortValues] = useState(JSON.parse(localStorage.getItem(SORT_ITEMS)))
  const [selectedSort, setSelectedSort] = useState(JSON.parse(localStorage.getItem(WS_SELECTED_SORT)) ?? "updated_at_desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const firstPage = 1

  const getWsAll = async () => {
    const token = Cookies.get(ACCESS_TOKEN)
    if (token && checkToken(token)) {
      let page = Number(currentPage) - 1
      const result = await fetchApiData(`workspace/all?page=${page + ""}&size=12&sort=${selectedSort}`, token)
      if (result && result.content) {
        const data = result.content
        setMaxPage(result.totalPages)
        if (data.length > 0) {
          setSelectedWs(localStorage.getItem(CURRENT_WS) ?? data[0].id)
          setWsList(data)
        } else {
          setWsList([])
        }

      }
    }
    setLoading(false)
  }

  useEffect(() => {
    document.title = "Space Application"
  }, [])



  const removeWs = async (id) => {
    const token = Cookies.get(ACCESS_TOKEN)
    if (token && checkToken(token)) {
      const getNoteByWs = await fetchApiData(`workspace/get/${id}`, token)
      localStorage.removeItem(CURRENT_WS)
      if (getNoteByWs) {
        const getResult = getNoteByWs.content
        if (getResult.length === 0) {
          await fetchApiData(`workspace/remove/${id}`, token, "DELETE")
          await getWsAll()
        }
      }
    }
  }



  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Đợi 1 giây trước khi hiển thị phần tử

    return () => clearTimeout(timeout);
  }, [noteCount]);

  useEffect(() => {
    getWsAll()
  }, [noteCount, currentPage, selectedSort])

  const RenderWsList = () => {
    return (
      wsList?.map((item, index) => (
        <WorkspaceCard key={index} setAddNoteState={setAddNoteState} removeWs={removeWs} wsItem={item} />
      ))
    )
  }

  const getNoteCount = (value) => {
    setNoteCount(value)
  }

  const addWorkspace = async () => {
    setLoadingAdd(true)
    const token = Cookies.get(ACCESS_TOKEN)
    if (token && checkToken(token)) {
      const addWsResult = await fetchApiData(`workspace/add`, token, "POST")
      if (addWsResult.status === "SUCCESS")
        localStorage.setItem(CURRENT_WS, addWsResult.content.id)
      await getWsAll()
    }
    setLoadingAdd(false)
  }

  const sortHandle = (value) => {
    setSelectedSort(value.target.value)
    localStorage.setItem(WS_SELECTED_SORT, JSON.stringify(value.target.value))
  }

  const RenderSort = () => {
    return (
      <select className='w-full lg:w-fit bg-white border p-2 font-bold cursor-pointer rounded-md text-sm' name='sort_note' id='sort_note'
        value={selectedSort} onChange={(e) => sortHandle(e)}>
        {sortValues?.map((item, index) => {
          const keys = Object.keys(item)[0]; // Lấy key (chỉ có 1 key trong mỗi đối tượng)
          const value = item[keys]; // Lấy giá trị

          return (
            <option key={index} value={value}>{keys}</option>
          );
        })}

      </select>
    )
  }

  const Pagination = () => {
    return (
      <div className={`${maxPage > 0 ? "opacity-100" : "opacity-0"} flex w-full flex-row justify-center my-3`}>
        <p className='text-sm w-full lg:w-1/5 text-center flex flex-row items-center justify-between'>
          <span className={`cursor-pointer pagingation-num transition-all ${currentPage === firstPage && 'fill-slate-300'}`} onClick={() => setPage("PREV")}>
            <svg className='rotate-180' height="20" id="Layer_1" viewBox="0 0 200 200" width="20" xmlns="http://www.w3.org/2000/svg"><title /><path d="M132.72,78.75l-56.5-56.5a9.67,9.67,0,0,0-14,0,9.67,9.67,0,0,0,0,14l56.5,56.5a9.67,9.67,0,0,1,0,14l-57,57a9.9,9.9,0,0,0,14,14l56.5-56.5C144.22,109.25,144.22,90.25,132.72,78.75Z" /></svg>
          </span>

          <span className={`w-5 h-5 pagingation-num text-center cursor-pointer transition-all ${currentPage === 1 ? "page-active" : 'pagingation-num '}`} onClick={() => setCurrentPage(1)}>1</span>

          <span className={`${maxPage > 2 ? "flex" : "hidden"} transition-all w-5 h-5 pagingation-num text-center cursor-pointer ${currentPage === firstPage + 1 && "page-active"}`}
            onClick={() => setPage("NEXT")}>{firstPage + 1}</span>

          <span className={`${maxPage > 5 ? "flex" : "hidden"} `}>...</span>

          <span className={`${maxPage > 3 ? "flex" : "hidden"} transition-all w-5 h-5 pagingation-num text-center cursor-pointer ${currentPage === maxPage - 1 && "page-active"}`}
            onClick={() => setCurrentPage(maxPage - 1)}>{maxPage - 1}</span>

          <span className={`w-5 h-5 pagingation-num text-center cursor-pointer transition-all ${firstPage === maxPage && "hidden"} ${currentPage === maxPage && "page-active"}`} onClick={() => setCurrentPage(maxPage)}>{maxPage}</span>

          <span className={`cursor-pointer transition-all  ${currentPage === maxPage ? 'fill-slate-300' : 'pagingation-num '}`} onClick={() => setPage("NEXT")}>
            <svg className='' height="20" id="Layer_1" viewBox="0 0 200 200" width="20" xmlns="http://www.w3.org/2000/svg"><title /><path d="M132.72,78.75l-56.5-56.5a9.67,9.67,0,0,0-14,0,9.67,9.67,0,0,0,0,14l56.5,56.5a9.67,9.67,0,0,1,0,14l-57,57a9.9,9.9,0,0,0,14,14l56.5-56.5C144.22,109.25,144.22,90.25,132.72,78.75Z" /></svg>
          </span>
        </p>
      </div>
    )
  }

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

  return (
    <>
      <LoadingComponent className={`${isLoading ? "block m-auto" : "hidden"}`} />

      <div className={`${isLoading ? "hidden" : "flex"} w-full h-full flex-row`}>
        <div className='w-full py-2 overflow-y-auto'>
          <div className='w-full flex gap-5 justify-between items-center pb-2'>
            <div className='flex items-center gap-2'>
              <p className='font-bold hidden lg:block text-xl'>Workspace</p>
              <div className={"flex flex-row gap-5 w-32"}>
                <button onClick={() => addWorkspace()}
                  disabled={isLoadingAdd}
                  className='button_style-1 py-2 px-3 w-full cursor-pointer transition-all rounded-md whitespace-nowrap text-black bg-white lg:hover:scale-105 font-bold text-sm'>
                  {isLoadingAdd ? <LoadingComponent className={`w-full`} size={`w-5 h-5 mx-auto`} /> : <span className='text-center block'>Add plan +</span>}
                </button>
              </div>
            </div>
            <div className=''>
              <RenderSort />
            </div>
          </div>
          <div className='w-full h-fit mt-2'>
            <div className='w-full justify-between hidden lg:flex rounded-sm my-2 p-2 italic text-sm'>
              <p>Name</p>
              <p>Time</p>
              <p>Actions</p>
            </div>
            <RenderWsList />
          </div>
          <Pagination />
        </div>
      </div>
    </>
  )
}

export default Home
