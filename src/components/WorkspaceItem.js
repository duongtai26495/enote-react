import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import { access_token, currentWs } from '../utils/constants'
import { checkToken, fetchApiData, getTheTime } from '../utils/functions'


const WorkspaceItem = ({ wsItem, removeWs }) => {
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


    const toggleActions = () => setOpenAction(preState => !preState)

    const toggleEdit = () => setEditWs(preState => !preState)


    return (

        <div className={`flex flex-row md:flex-row items-center rounded-md p-1 px-3`}>
            {
                (isEdit && selectedWs === currentWssItem.id)
                    ?
                    <input
                        id='ws_name'
                        name='ws_name'
                        onBlur={() => { updateWsName() }}
                        autoFocus
                        className='m-w-fit ws-item bg-transparent px-2 py-1'
                        type='text'
                        defaultValue={newNameWs}
                        onChange={(e) => { setNewNameWs(e.target.value) }} />
                    :
                    <span onClick={() => { }} className='w-fit ws-item flex flex-col bg-transparent px-2 py-1'>
                        {currentWssItem.name}
                        {
                            currentWssItem.created_at &&
                            <span className={`ws-time text-slate-400 italic`}>{getTheTime(currentWssItem.created_at)}</span>
                        }
                    </span>
            }
            <div className={`w-fit transition-all gap-2 border-l pl-2 ease-out duration-700 overflow-hidden flex-col items-center justify-center ws-action relative ${selectedWs === currentWssItem.id ? "flex" : "hidden"}`}>

                <span className='flex flex-row items-center ws-edit-btn lg:hover:scale-110' onClick={toggleEdit} >
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
                <span onClick={() => { removeWs(currentWssItem.id) }} className='lg:hover:scale-110 text-xs text-red-700 rounded text-center ws-remove-btn transition-all'>
                    <svg height={"14"} width={"14"} viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M53.21 467c1.562 24.84 23.02 45 47.9 45h245.8c24.88 0 46.33-20.16 47.9-45L416 128H32L53.21 467zM432 32H320l-11.58-23.16c-2.709-5.42-8.25-8.844-14.31-8.844H153.9c-6.061 0-11.6 3.424-14.31 8.844L128 32H16c-8.836 0-16 7.162-16 16V80c0 8.836 7.164 16 16 16h416c8.838 0 16-7.164 16-16V48C448 39.16 440.8 32 432 32z" /></svg>
                </span>

            </div>
        </div>
    )
}

export default WorkspaceItem