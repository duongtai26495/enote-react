import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { ACCESS_TOKEN, CURRENT_WS, WS_SELECTED_SORT, SORT_ITEMS, SUCCESS_RESULT } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'

import LoadingComponent from '../components/LoadingComponent'
import WorkspaceCard from '../components/WorkspaceCard'
import Pagination from '../components/Pagination'
const Home = () => {

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

  const getWsAll = async () => {
    if (token && checkToken(token)) {
      await getWsInBackground()
    }
    setLoading(false)
  }

  useEffect(() => {
    document.title = "Space Application"
  }, [])

  const getWsInBackground = async () => {
    let page = Number(currentPage) - 1
    const result = await fetchApiData(`workspace/all?page=${page + ""}&size=12&sort=${selectedSort}`, token)
    setMaxPage(result.totalPages)
    setEmptyList(result.empty)
    setElPerPage(result.totalElements)
    setMaxElPerPage(result.size)
    const data = result.content
    if (data && data?.length > 0) {
      setWsList(data)
    } else {
      setWsList([])
      setCurrentPage(1)
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

  useEffect(() => {
    getListWs()
  }, [maxPage, deleteId])

  useEffect(() => {
    getWsAll()
  }, [currentPage, selectedSort])

  const RenderWsList = () => {
    return (
      wsList?.map((item, index) => (
        <WorkspaceCard key={index} removeWs={removeWs} wsItem={item} />
      ))
    )
  }


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
    const sortValues = JSON.parse(localStorage.getItem(SORT_ITEMS))

    return (
      <select className='w-full lg:w-fit bg-white border p-2 font-bold cursor-pointer rounded-md text-sm' name='sort_note' id='sort_note'
        value={selectedSort} onChange={(e) => sortHandle(e)}>
        {sortValues?.map((item, index) => {
          return (
            <option key={index} value={item.value}>{item.name}</option>
          );
        })}

      </select>
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


      <div className={`${isLoading ? "hidden" : "flex"} w-full h-full flex-col`}>
        <div className='w-full flex gap-5 justify-between items-center p-2 bg-slate-300 sticky top-0 z-40'>
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
        <div className='w-full h-fit mt-2 '>
          <div className={`${wsList?.length > 0 ? "border-none" : "border-b border-zinc-300"} w-full justify-between hidden lg:flex rounded-sm my-2 p-2 italic text-sm`}>
            <p>Name</p>
            <p>Time</p>
            <p>Actions</p>
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
