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


  const getWsAll = async () => {
    const token = Cookies.get(ACCESS_TOKEN)
    if (token && checkToken(token)) {
      const result = await fetchApiData(`workspace/all?sort=${selectedSort}`, token)
      if (result && result.content) {
        const data = result.content
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
  const setAddNote = (value) => {
    setAddNoteState(value)
  }

  const setCURRENT_WS = (id) => {
    if (selectedWs !== CURRENT_WS) {
      localStorage.removeItem(CURRENT_WS)
      setSelectedWs(id)
      localStorage.setItem(CURRENT_WS, id)
    }
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
  }, [noteCount, selectedSort])

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
  return (
    <>
      <LoadingComponent className={`${isLoading ? "block m-auto" : "hidden"}`} />

      <div className={`${isLoading ? "hidden" : "flex"} w-full h-full flex-row`}>
        <div className='w-full py-2 overflow-y-auto'>
          <div className='w-full flex gap-5 justify-between items-center pb-2'>
          <div className='flex items-center gap-2'>
            <p className='font-bold text-xl'>Workspace</p>
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

        </div>
      </div>
    </>
  )
}

export default Home
