import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { access_token, currentWs } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteList from '../components/NoteList'
import WorkspaceItem from '../components/WorkspaceItem'
import ChatAssist from '../components/ChatAssist'
const Home = () => {

  const [isVisible, setIsVisible] = useState(false);
  const [noteCount, setNoteCount] = useState(0)
  const [wsList, setWsList] = useState([])
  const [selectedWs, setSelectedWs] = useState(Number(localStorage.getItem(currentWs)))
  const [addNoteState, setAddNoteState] = useState(false)
  
  const getWsAll = async () => {
    const token = Cookies.get(access_token)
    if (token && checkToken(token)) {
      const result = await fetchApiData("workspace/all", token)
      if(result && result.status !== 403){
        const data = result.content
        if(data.length > 0){
          setSelectedWs(data[0].id)
          setWsList(data)
        }
        
      }
    }
  }
  const setAddNote = (value) => {
    setAddNoteState(value)
  }

  const setCurrentWs = (id) => {
    setSelectedWs(id)
    localStorage.setItem(currentWs, id)
  }


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
          className={`${selectedWs === item.id ? "selected_ws_true bg-slate-100":""} relative selected_ws flex flex-row gap-1 items-center ws-item whitespace-nowrap pb-3 md:pb-5 pt-2 cursor-pointer transition-all w-fit`}
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
    const token = Cookies.get(access_token)
    if (token && checkToken(token)) {
      const addNoteResult = await fetchApiData(`workspace/add`, token, "POST")
      if (addNoteResult.status === "SUCCESS")
        await getWsAll()
    }
  }

  return (
    <div className='w-full h-full flex flex-row '>
      <div className='w-full py-2 overflow-y-auto'>
        <div className='w-full flex flex-row gap-5 items-center pb-2'>
          <p className='font-bold text-xl'>Workspace</p>
          <ul className={"flex flex-row gap-5 w-fit"}>
            <li onClick={() => addWorkspace()}
              className='button_style-1 py-2 px-3 cursor-pointer transition-all rounded-full whitespace-nowrap text-black bg-white lg:hover:scale-105 font-bold text-sm'>
              Add plan +
              </li>
          </ul>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <ul className={`flex flex-row  w-full overflow-x-auto relative`}>
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
  )
}

export default Home