import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import { access_token, currentWs } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'

const WorkspaceItem = ({ wsItem, removeWs, setAddNoteState }) => {
    const [newNameWs, setNewNameWs] = useState(wsItem.name)
    const [currentWssItem, setCurrentWsItem] = useState(wsItem)
    const [selectedWs, setSelectedWs] = useState(Number(localStorage.getItem(currentWs)))
    const [isOpenAction, setOpenAction] = useState(false)
    const [isEdit, setEditWs] = useState(false)
    const updateWsName = async () => {
        const token = Cookies.get(access_token)
        if (token !== null && checkToken(token)) {
            let newWs = currentWssItem
            newWs.name = newNameWs
            try {
                const resultUpdate = await fetchApiData(`workspace/update`, token, "PUT", newWs)
                if (resultUpdate.status === "SUCCESS") {
                    setCurrentWsItem(resultUpdate.content)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const addNewNote = async (wsId) => {
        setAddNoteState(true)
        const token = Cookies.get(access_token)
        if (token !== null && checkToken(token)) {
            const newNote = {}
            newNote.workspace = { id: wsId }
            newNote.name = "Unnamed note"
            try {
                await fetchApiData(`note/add`, token, "POST", newNote)
            } catch (error) {
                console.log(error)
            }
        }

    }

    const toggleActions = () => setOpenAction(preState => !preState)

    const toggleEdit = () => setEditWs(preState => !preState)


    return (
        <>{
            (isEdit && Number(localStorage.getItem(currentWs)) === currentWssItem.id)
                ?
                <input
                    onBlur={() => { updateWsName() }}
                    autoFocus
                    className='m-w-fit ws-item bg-transparent px-2 py-1'
                    type='text'
                    defaultValue={newNameWs}
                    onChange={(e) => { setNewNameWs(e.target.value) }} />
                :
                <span onClick={() => { }} className='w-fit ws-item bg-transparent px-2 py-1'>
                    {currentWssItem.name}
                </span>
        }
            <span onClick={() => { addNewNote(currentWssItem.id) }} className={`${selectedWs === currentWssItem.id ? "flex" : "hidden"} button_style-1  hover:bg-slate-200 w-fit h-fit font-bold rounded-full px-2 text-center z-10 p-1  bg-white text-black transition-all text-xs `}>
                Add note
            </span>
            <span className={`${selectedWs === currentWssItem.id ? "block" : "hidden"} transition-all`} onClick={toggleActions}>
                <svg className={`${(isOpenAction && selectedWs === currentWssItem.id) ? "rotate-0" : "rotate-180"} transition-all`} height={"24"} width={"24"} id="Layer_1" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" ><path d="M327.3,98.9l-2.1,1.8l-156.5,136c-5.3,4.6-8.6,11.5-8.6,19.2c0,7.7,3.4,14.6,8.6,19.2L324.9,411l2.6,2.3  c2.5,1.7,5.5,2.7,8.7,2.7c8.7,0,15.8-7.4,15.8-16.6h0V112.6h0c0-9.2-7.1-16.6-15.8-16.6C332.9,96,329.8,97.1,327.3,98.9z" /></svg>
            </span>

            <div className={`${isOpenAction ? "w-full" : "w-0"} transition-all ease-out duration-700 overflow-hidden flex-row items-center justify-around ws-action relative ${selectedWs === currentWssItem.id ? "flex" : "hidden"}`}>

                <span className='flex flex-row items-center ws-edit-btn hover:scale-110' onClick={toggleEdit} >
                    {
                        isEdit
                            ?
                            <svg height={"22"} width={"22"} version="1.1" viewBox="0 0 24 24" ><g id="info" />
                                <g id="icons"><path d="M10,18c-0.5,0-1-0.2-1.4-0.6l-4-4c-0.8-0.8-0.8-2,0-2.8c0.8-0.8,2.1-0.8,2.8,0l2.6,2.6l6.6-6.6   c0.8-0.8,2-0.8,2.8,0c0.8,0.8,0.8,2,0,2.8l-8,8C11,17.8,10.5,18,10,18z" id="check" /></g></svg>
                            :
                            <svg height="14" version="1.1" viewBox="0 0 18 18" width="14" xmlns="http://www.w3.org/2000/svg" >
                                <g fill="none" fillRule="evenodd" id="Page-1" stroke="none" strokeWidth="1"><g fill="#000000" id="Core" transform="translate(-213.000000, -129.000000)"><g id="create" transform="translate(213.000000, 129.000000)"><path d="M0,14.2 L0,18 L3.8,18 L14.8,6.9 L11,3.1 L0,14.2 L0,14.2 Z M17.7,4 C18.1,3.6 18.1,3 17.7,2.6 L15.4,0.3 C15,-0.1 14.4,-0.1 14,0.3 L12.2,2.1 L16,5.9 L17.7,4 L17.7,4 Z" id="Shape" /></g></g></g></svg>
                    }
                </span>
                <span onClick={() => { removeWs(currentWssItem.id) }} className='hover:scale-110 text-xs text-red-700 rounded ml-2 text-center ws-remove-btn transition-all'>
                    <svg height={"14"} width={"14"} viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M53.21 467c1.562 24.84 23.02 45 47.9 45h245.8c24.88 0 46.33-20.16 47.9-45L416 128H32L53.21 467zM432 32H320l-11.58-23.16c-2.709-5.42-8.25-8.844-14.31-8.844H153.9c-6.061 0-11.6 3.424-14.31 8.844L128 32H16c-8.836 0-16 7.162-16 16V80c0 8.836 7.164 16 16 16h416c8.838 0 16-7.164 16-16V48C448 39.16 440.8 32 432 32z" /></svg>
                </span>

            </div>

        </>
    )
}

export default WorkspaceItem