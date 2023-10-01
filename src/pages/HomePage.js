import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { ACCESS_TOKEN, CURRENT_WS, WS_SELECTED_SORT, SORT_ITEMS, SUCCESS_RESULT, CURRENT_WS_PAGE, SORT_WS_ITEMS, DISPLAY_TYPE, GRID, COLS, SORTS } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'

import LoadingComponent from '../components/LoadingComponent'
import WorkspaceCard from '../components/WorkspaceCard'
import Pagination from '../components/Pagination'
import ProfileAnalytics from '../components/ProfileAnalytics'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { useTranslation } from 'react-i18next'
const Home = () => {

  const {t} = useTranslation()
  const [isLoading, setLoading] = useState(true)
  const [wsList, setWsList] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [isLoadingAdd, setLoadingAdd] = useState(false)
  const [selectedSort, setSelectedSort] = useState(JSON.parse(localStorage.getItem(WS_SELECTED_SORT)) ?? "updated_at_desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [elementPerPage, setElPerPage] = useState(0)
  const [maxElelentPerPage, setMaxElPerPage] = useState(0)
  const [emptyList, setEmptyList] = useState(true)
  const firstPage = 1
  const token = Cookies.get(ACCESS_TOKEN)
  const page = currentPage > 0 ? Number(currentPage) - 1 : 0
  const [displayType, setDisplayType] = useState(localStorage.getItem(DISPLAY_TYPE) ?? GRID)

  const getWsAll = async () => {
    if (token && checkToken(token)) {
      await getWsInBackground()
    }
    setLoading(false)
  }

  useEffect(() => {
    document.title = "Space Application"
  }, [])

  useEffect(() => {
    getListWs()
  }, [maxPage, deleteId])

  useEffect(() => {
    getWsAll()
  }, [currentPage, selectedSort])

  const selectDisplayType = (TYPE) => {
    setDisplayType(TYPE)
    localStorage.setItem(DISPLAY_TYPE, TYPE)
  }

  const getWsInBackground = async () => {
    const result = await fetchApiData(`workspace/all?page=${page + ""}&size=24&sort=${selectedSort}`, token)
    setMaxPage(result.totalPages)
    setEmptyList(result.empty)
    setElPerPage(result.totalElements)
    setMaxElPerPage(result.size)
    const data = result.content
    if (data && data?.length > 0) {
      setWsList(data)
    } else {
      setWsList([])
      setCurrentPage(firstPage)
    }
    return result
  }

  const removeWs = (id) => {
    setDeleteId(id)
  }


  const removeWsById = async () => {
    if (token && checkToken(token)) {
      const getNoteByWs = await fetchApiData(`workspace/get/${deleteId}`, token)
      localStorage.removeItem(CURRENT_WS)
      if (getNoteByWs) {
        const getResult = getNoteByWs.content
        if (getResult.length === 0) {
          await fetchApiData(`workspace/remove/${deleteId}`, token, "DELETE")
          await getWsAll()
          setDeleteId(null)
        }
      }
    }
  }

  const getListWs = async () => {
    let newList = wsList
    if (deleteId) {
      newList = wsList.filter(item => item.id !== deleteId);
      await removeWsById()
    }
    if (newList?.length < maxElelentPerPage) {
      await getWsInBackground()
    } else {
      setWsList(newList)
    }
  }

  const RenderWsList = React.memo(() => {
    if (displayType === COLS) {

      return (
        wsList?.map((item, index) => (
          <WorkspaceCard type={COLS} key={index} removeWs={removeWs} wsItem={item} />
        ))
      )
    }

    if (displayType === GRID) {
      return (
        <ResponsiveMasonry className='h-fit masonry-wrapper' columnsCountBreakPoints={{ 350: 2, 767: 3, 960: 3 }}>
          <Masonry>
            {
              wsList?.map((item, index) => (
                <WorkspaceCard type={GRID} key={index} removeWs={removeWs} wsItem={item} />
              ))
            }
          </Masonry>
        </ResponsiveMasonry>
      )
    }
  })


  const addWorkspace = async () => {
    setLoadingAdd(true)
    if (token && checkToken(token)) {
      const addWsResult = await fetchApiData(`workspace/add`, token, "POST")
      if (addWsResult.status === SUCCESS_RESULT)
        await getWsInBackground()
    }
    setLoadingAdd(false)
  }

  const sortHandle = (value) => {
    setSelectedSort(value.target.value)
    localStorage.setItem(WS_SELECTED_SORT, JSON.stringify(value.target.value))
  }

  const RenderSort = () => {

    const sortValues =  SORTS.filter((item, index) => (index >= 0 && index <= 5) || index === 8 || index === 9);

    return (
      <div className='w-fit flex gap-1 items-center font-bold'>
      <label className='hidden lg:block text-sm'>{t('sorts.sorting')}</label>
      <select className='w-full lg:w-fit bg-white border p-2 font-bold cursor-pointer rounded-md text-sm' name='sort_note' id='sort_note'
        value={selectedSort} onChange={(e) => sortHandle(e)}>
        {sortValues?.map((item, index) => {
          return (
            <option key={index} value={item.value}>{t(item.name)}</option>
          );
        })}

      </select>
      </div>
    )
  }



  const setPage = (TYPE) => {
    switch (TYPE) {
      case "PREV":
        if (currentPage > 1) {
          let current = Number(currentPage) - 1
          setCurrentPage(current)
          localStorage.setItem(CURRENT_WS_PAGE, current)
        }
        break;
      case "NEXT":
        if (currentPage < maxPage) {
          let current = Number(currentPage) + 1
          setCurrentPage(current)
          localStorage.setItem(CURRENT_WS_PAGE, current)
        }
        break;
    }
  }

  return (
    <>
      <LoadingComponent className={`${isLoading ? "block m-auto" : "hidden"}`} />

        <div className={`${isLoading ? "hidden" : "flex"} bg-white bg-opacity-10 w-full h-full flex-col mt-5 mb-16 rounded-lg overflow-hidden border shadow-lg relative`}>
          <div className='w-full flex gap-5 justify-between items-center p-2 bg-white bg-opacity-50 sticky top-0 z-40'>
            <div className='flex items-center gap-2'>
              <p className='font-bold hidden whitespace-nowrap lg:block text-xl'>{t('workspace.workspaces')}</p>
              <div className={"flex flex-row gap-5 w-14 min-w-fit"}>
                <button onClick={() => addWorkspace()}
                  disabled={isLoadingAdd}
                  className='button_style-1 py-2 px-3 w-full border cursor-pointer transition-all rounded-md whitespace-nowrap text-black bg-white lg:hover:scale-105 font-bold text-sm'>
                  {isLoadingAdd ? <LoadingComponent className={`w-full`} size={`w-5 h-5 mx-auto`} /> : <span className='text-center block'>{t('workspace.add')}</span>}
                </button>
              </div>
            </div>
            <div className=''>
              <RenderSort />
            </div>
            <div className={`flex gap-3`}>
              <button onClick={() => selectDisplayType(COLS)} className={`${displayType === COLS ? "selected_display_type" : ""} w-10 h-10 flex items-center justify-center p-1 display_type transition-all rounded-full`}>
                <svg className={`w-6 h-6 `} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path className={`fill-black`} clipRule="evenodd" d="M20 4H4C3.44771 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V5C21 4.44771 20.5523 4 20 4ZM4 2C2.34315 2 1 3.34315 1 5V19C1 20.6569 2.34315 22 4 22H20C21.6569 22 23 20.6569 23 19V5C23 3.34315 21.6569 2 20 2H4ZM6 7H8V9H6V7ZM11 7C10.4477 7 10 7.44772 10 8C10 8.55228 10.4477 9 11 9H17C17.5523 9 18 8.55228 18 8C18 7.44772 17.5523 7 17 7H11ZM8 11H6V13H8V11ZM10 12C10 11.4477 10.4477 11 11 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H11C10.4477 13 10 12.5523 10 12ZM8 15H6V17H8V15ZM10 16C10 15.4477 10.4477 15 11 15H17C17.5523 15 18 15.4477 18 16C18 16.5523 17.5523 17 17 17H11C10.4477 17 10 16.5523 10 16Z" fill="currentColor" fillRule="evenodd" /></svg>
              </button>

              <button onClick={() => selectDisplayType(GRID)} className={`${displayType === GRID ? "selected_display_type" : ""} w-10 h-10 flex items-center justify-center p-1 display_type transition-all rounded-full`}>
                <svg className={`w-6 h-6 fill-black`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11,4 L4,4 L4,20 L11,20 L11,10 L4,10 L4,8 L11,8 L11,4 Z M13,4 L13,14 L20,14 L20,16 L13,16 L13,20 L20,20 L20,4 L13,4 Z M4,2 L20,2 C21.1045695,2 22,2.8954305 22,4 L22,20 C22,21.1045695 21.1045695,22 20,22 L4,22 C2.8954305,22 2,21.1045695 2,20 L2,4 C2,2.8954305 2.8954305,2 4,2 Z" fillRule="evenodd" /></svg>
              </button>
            </div>
          </div>
          <div className={`w-full h-fit mt-2 px-2`}>
            <div className={` w-full justify-between ${(displayType === GRID || wsList?.length < 1) ? "hidden" : "hidden lg:flex"} rounded-sm my-2 p-2 italic text-sm`}>
              <p>{t('workspace.name')}</p>
              <p>{t('workspace.time')}</p>
              <p>{t('workspace.actions')}</p>
            </div>
            <RenderWsList />
          </div>
          <Pagination
            className={`${wsList.length > 0 ? "flex" : "hidden"} overflow-hidden justify-center my-3`}
            currentPage={currentPage}
            maxPage={maxPage}
            firstPage={firstPage}
            setCurrentPage={setCurrentPage}
            setPage={setPage}
          />

        </div>
    </>
  )
}

export default Home
