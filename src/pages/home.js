import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { access_token, currentWs } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'

import LoadingComponent from '../components/LoadingComponent'
import WorkspaceCard from '../components/WorkspaceCard'
const Home = () => {

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setLoading] = useState(true)
  const [noteCount, setNoteCount] = useState(0)
  const [wsList, setWsList] = useState([])
  const [selectedWs, setSelectedWs] = useState(localStorage.getItem(currentWs))
  const [addNoteState, setAddNoteState] = useState(false)
  const [isLoadingAdd, setLoadingAdd] = useState(false)

  const getWsAll = async () => {
    const token = Cookies.get(access_token)
    if (token && checkToken(token)) {
      const result = await fetchApiData("workspace/all", token)
      if (result && result.status !== 403) {
        const data = result.content
        if (data.length > 0) {
          setSelectedWs(localStorage.getItem(currentWs) ?? data[0].id)
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

  const setCurrentWs = (id) => {
    if (selectedWs !== currentWs) {
      localStorage.removeItem(currentWs)
      setSelectedWs(id)
      localStorage.setItem(currentWs, id)
    }
  }
  useEffect(() => {
    document.title = "Space Application"
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

  // const RenderWsList = () => {
  //   return (
  //     wsList &&
  //     wsList.map(item => (
  //       <li
  //         onClick={() => setCurrentWs(item.id)}
  //         className={`${Number(selectedWs) === item.id ? "selected_ws_true bg-white" : ""} shadow-sm relative selected_ws flex flex-row gap-1 items-center ws-item whitespace-nowrap cursor-pointer rounded-md transition-all w-fit`}
  //         key={item.id}>
  //         <WorkspaceItem setAddNoteState={setAddNoteState} removeWs={removeWs} wsItem={item} />

  //       </li>
  //     ))
  //   )
  // }

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
                {isLoadingAdd ? <LoadingComponent className={`w-full`} size={`w-5 h-5 mx-auto`} /> : <span className='text-center block'>Add plan +</span>}
              </button>
            </div>
          </div>
          <div className='w-full h-fit mt-2'>
          <div className='w-full justify-between hidden lg:flex rounded-sm my-2 p-2 italic text-sm'>
          <p>Name</p>
          <p>Actions</p>
          <p>Time</p>
          </div>
              {/* List of Workspace */}
              <RenderWsList />
          </div>
          {/* <div className={`w-full slide-up  ${isVisible ? 'visible' : ''}`}> */}
            {/* List of Note list */}
            {/* <NoteList addNoteState={addNoteState} setAddNote={setAddNote} getNoteCount={getNoteCount} id={selectedWs} /> */}
          {/* </div> */}
        </div>
      </div>
    </>
  )
}

export default Home
