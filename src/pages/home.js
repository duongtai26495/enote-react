import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { SORT_ITEMS, SORT_TASK_ITEMS, access_token, currentWs, localWs } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteList from '../components/NoteList'
import WorkspaceItem from '../components/WorkspaceItem'
import LoadingAnimation from '../components/LoadingAnimation'
import LoadingComponent from '../components/LoadingComponent'
const Home = () => {

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setLoading] = useState(true)
  const [noteCount, setNoteCount] = useState(0)
  const [wsList, setWsList] = useState([])
  const [selectedWs, setSelectedWs] = useState(localStorage.getItem(currentWs))
  const [addNoteState, setAddNoteState] = useState(false)
  const [isLoadingAdd, setLoadingAdd] = useState(false)
  const [sortItem, setSortItem] = useState([])
  
  const getWsAll = async () => {
    const token = Cookies.get(access_token)
    if (token && checkToken(token)) {
      const result = await fetchApiData("workspace/all", token)
      if (result && result.status !== 403) {
        const data = result.content
        if (data.length > 0) {
          setSelectedWs(localStorage.getItem(currentWs) ?? data[0].id)
          setWsList(data)
        }else{
          setWsList([])
        }

      }
    }
    setLoading(false)
  }
  const setAddNote = (value) => {
    setAddNoteState(value)
  }

  const setCurrentWs = (id) => {
    setSelectedWs(id)
    localStorage.setItem(currentWs, id)
  }
  useEffect(() => {
    document.title = "Ememo Application"
  }, [])



  const removeWs = async (id) => {
    const token = Cookies.get(access_token)
    if (token && checkToken(token)) {
      const getNoteByWs = await fetchApiData(`workspace/get/${id}`, token)
      localStorage.removeItem(currentWs)
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
  }, [noteCount])

  const RenderWsList = () => {
    return (
      wsList &&
      wsList.map(item => (
        <li
          onClick={() => setCurrentWs(item.id)}
          className={`${Number(selectedWs) === item.id ? "selected_ws_true bg-slate-100" : "border-t border-l border-teal-50"} relative selected_ws flex flex-row gap-1 items-center ws-item whitespace-nowrap pb-3 md:pb-5 pt-2 cursor-pointer transition-all w-fit`}
          key={item.id}>
          <WorkspaceItem setAddNoteState={setAddNoteState} removeWs={removeWs} wsItem={item} />

        </li>
      ))
    )
  }

  const getNoteCount = (value) => {
    setNoteCount(value)
  }

  const addWorkspace = async () => {
    setLoadingAdd(true)
    const token = Cookies.get(access_token)
    if (token && checkToken(token)) {
      const addWsResult = await fetchApiData(`workspace/add`, token, "POST")
      if (addWsResult.status === "SUCCESS")
        localStorage.setItem(currentWs, addWsResult.content.id)
        await getWsAll()
    }
    setLoadingAdd(false)
  }

  return (
    <>
      <LoadingComponent className={`${isLoading ? "block m-auto" : "hidden"}`} />

      <div className={`${isLoading ? "hidden" : "flex"} w-full h-full flex-row`}>
        <div className='w-full py-2 overflow-y-auto'>
          <div className='w-full flex flex-row gap-5 items-center pb-2'>
            <p className='font-bold text-xl'>Workspace</p>
            <div className={"flex flex-row gap-5 w-32"}>
              <button onClick={() => addWorkspace()}
              disabled={isLoadingAdd}
                className='button_style-1 py-2 px-3 w-full cursor-pointer transition-all rounded-xl whitespace-nowrap text-black bg-white lg:hover:scale-105 font-bold text-sm'>
                { isLoadingAdd ? <LoadingComponent className={`w-full`} size={`w-5 h-5 mx-auto`}/> : <span className='text-center block'>Add plan +</span> }
              </button>
            </div>
          </div>
          <div className='flex flex-row justify-between items-center'>
            <ul className={`flex flex-row w-full overflow-x-auto relative`}>
              {/* List of Workspace */}
              <RenderWsList />
            </ul>

          </div>
          <div className={`w-full slide-up  ${isVisible ? 'visible' : ''}`}>
            {/* List of Note list */}
            <NoteList addNoteState={addNoteState} setAddNote={setAddNote} getNoteCount={getNoteCount} id={selectedWs} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home