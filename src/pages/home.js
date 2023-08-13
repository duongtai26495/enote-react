import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { access_token, currentWs } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteList from '../components/NoteList'
import WorkspaceItem from '../components/WorkspaceItem'
const Home = () => {

  const [isVisible, setIsVisible] = useState(false);
  const [noteCount, setNoteCount] = useState(0)
  const [editState, setEditState] = useState(false)
  const [addNoteState, setAddNoteState] = useState(false)
  const [isOpenAction, setOpenAction] = useState(false)
  const getWsAll = async () => {
    const token = Cookies.get(access_token)
    if (token && checkToken(token)) {
      const result = await fetchApiData("workspace/all", token)
      if(result && result.status !== 403){
        const data = result.content
        setWsList(data)
      }
    }
  }
  const [wsList, setWsList] = useState([])
  const [selectedWs, setSelectedWs] = useState(Number(localStorage.getItem(currentWs)))

  const setCurrentWs = (id) => {
    setSelectedWs(id)
    localStorage.setItem(currentWs, id)
  }

  const setUpdateWs = (value) => {
    setEditState(value)
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

  const addNewNote = async (wsId) => {
    setAddNoteState(true)
    const token = Cookies.get(access_token)
    if (token !== null && checkToken(token)) {
        const newNote = {}
        newNote.workspace = {id:wsId}
        newNote.name = "Unnamed note"
        try {
            await fetchApiData(`note/add`, token, "POST", newNote)
        } catch (error) {
            console.log(error)
        }
    }

    setAddNoteState(false)
}

  const toggleEdit = () => setEditState(preState => !preState)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Đợi 1 giây trước khi hiển thị phần tử

    return () => clearTimeout(timeout);
  }, [noteCount]);

  useEffect(() => {
    getWsAll()
  }, [noteCount])

  const toggleActions = () => setOpenAction(preState => !preState)

  const RenderWsList = () => {
    return (
      wsList &&
      wsList.map(item => (
        <li
          onClick={() => setCurrentWs(item.id)}
          className={`${selectedWs === item.id ? "border-b-8 border-slate-800" : ""} flex flex-row gap-1 items-center ws-item whitespace-nowrap hover:border-b-8 py-5 cursor-pointer transition-all w-fit`}
          key={item.id}>
          <WorkspaceItem setUpdateWs={setUpdateWs} editState={editState} wsItem={item} />
          <span className={`${selectedWs === item.id ? "block": "hidden"} transition-all`} onClick={toggleActions}>
              <svg className={`${(isOpenAction && selectedWs === item.id) ? "rotate-0" : "rotate-180"} transition-all`} height={"24"} width={"24"} id="Layer_1" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" ><path d="M327.3,98.9l-2.1,1.8l-156.5,136c-5.3,4.6-8.6,11.5-8.6,19.2c0,7.7,3.4,14.6,8.6,19.2L324.9,411l2.6,2.3  c2.5,1.7,5.5,2.7,8.7,2.7c8.7,0,15.8-7.4,15.8-16.6h0V112.6h0c0-9.2-7.1-16.6-15.8-16.6C332.9,96,329.8,97.1,327.3,98.9z"/></svg>
            </span>
          <div className={`${isOpenAction ? "w-full" : "w-0"} transition-all ease-out duration-700 overflow-hidden flex-row items-center justify-around ws-action relative ${selectedWs === item.id ? "flex" : "hidden"}`}>
            
            <span className='flex flex-row items-center ws-edit-btn hover:scale-110' onClick={toggleEdit} >
              {
                editState
                  ?
                  <svg height={"22"} width={"22"} version="1.1" viewBox="0 0 24 24" ><g id="info" />
                    <g id="icons"><path d="M10,18c-0.5,0-1-0.2-1.4-0.6l-4-4c-0.8-0.8-0.8-2,0-2.8c0.8-0.8,2.1-0.8,2.8,0l2.6,2.6l6.6-6.6   c0.8-0.8,2-0.8,2.8,0c0.8,0.8,0.8,2,0,2.8l-8,8C11,17.8,10.5,18,10,18z" id="check" /></g></svg>
                  :
                  <svg height="14" version="1.1" viewBox="0 0 18 18" width="14" xmlns="http://www.w3.org/2000/svg" >
                    <g fill="none" fillRule="evenodd" id="Page-1" stroke="none" strokeWidth="1"><g fill="#000000" id="Core" transform="translate(-213.000000, -129.000000)"><g id="create" transform="translate(213.000000, 129.000000)"><path d="M0,14.2 L0,18 L3.8,18 L14.8,6.9 L11,3.1 L0,14.2 L0,14.2 Z M17.7,4 C18.1,3.6 18.1,3 17.7,2.6 L15.4,0.3 C15,-0.1 14.4,-0.1 14,0.3 L12.2,2.1 L16,5.9 L17.7,4 L17.7,4 Z" id="Shape" /></g></g></g></svg>
              }
            </span>
            <span onClick={() => { removeWs(item.id) }} className='hover:scale-110 text-xs text-red-700 rounded ml-2 text-center ws-remove-btn transition-all'>
              <svg height={"14"} width={"14"} viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M53.21 467c1.562 24.84 23.02 45 47.9 45h245.8c24.88 0 46.33-20.16 47.9-45L416 128H32L53.21 467zM432 32H320l-11.58-23.16c-2.709-5.42-8.25-8.844-14.31-8.844H153.9c-6.061 0-11.6 3.424-14.31 8.844L128 32H16c-8.836 0-16 7.162-16 16V80c0 8.836 7.164 16 16 16h416c8.838 0 16-7.164 16-16V48C448 39.16 440.8 32 432 32z" /></svg>
            </span>
            <span onClick={()=>{addNewNote(item.id)}} className='w-fit h-fit font-bold rounded-full px-2 text-center z-10 p-1  bg-white text-black transition-all text-xs ml-3'>
              Add note
            </span>
          </div>

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
    <div className='w-full flex flex-row '>
      <div className='w-full lg:w-2/3 py-2 overflow-y-auto'>
        <div className='w-full flex flex-row gap-5 items-center pb-2'>
          <p className='font-bold text-xl'>Workspace</p>
          <ul className={"flex flex-row gap-5 w-fit"}>
            <li onClick={() => addWorkspace()}
              className='py-2 px-3 cursor-pointer  transition-all rounded-full whitespace-nowrap text-black bg-white hover:scale-105 font-bold text-sm'>
              Add plan +
              </li>
          </ul>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <ul className={`flex flex-row border-b gap-5 w-full overflow-x-auto`}>
            <RenderWsList />
          </ul>

        </div>
        <div className={`w-full slide-up  ${isVisible ? 'visible' : ''}`}>
          <NoteList addNoteState={addNoteState} getNoteCount={getNoteCount} id={selectedWs} />
        </div>
      </div>
      <div className='w-1/3 min-h-full hidden lg:flex bg-transparent border p-3'>
        Chat
      </div>
    </div>
  )
}

export default Home