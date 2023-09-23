import React, {useEffect} from 'react'
import { checkToken, fetchApiData, getTheTime } from '../utils/functions'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { ACCESS_TOKEN, SUCCESS_RESULT } from '../utils/constants'

const WorkspaceCard = ({ wsItem, removeWs }) => {

    const [workspaceItem, setWorkspaceItem] = useState(wsItem)
    const [isConfirm, setConfirm] = useState(false)
    const [isUpdateName, setUpdateName] = useState(false)
    const [newWsName, setNewWsName] = useState(workspaceItem.name)

    const updateNewName = async () => {
        let newName = newWsName
        if (newName === "") {
            setNewWsName(workspaceItem.name)
            setUpdateName(false)
        } else {
            const token = Cookies.get(ACCESS_TOKEN)
            let newWs = wsItem
            newWs.name = newName
            if (checkToken(token)) {
                const result = await fetchApiData(`workspace/update`, token, "PUT", newWs)
                if (result.status === SUCCESS_RESULT) {
                    setWorkspaceItem(result.content)
                }
            }else{
                
            }
            setUpdateName(false)
        }
    }

    const remove_workspace = async () => {
        removeWs(workspaceItem.id)
    }

    const toggleConfirm = () => {
        setConfirm(prevState => !prevState)
    }

    return (
        <div className={`border-l-4 border-l-blue-500 w-full flex p-2 mb-2 relative bg-white overflow-hidden justify-between items-center rounded-md lg:hover:shadow-lg transition-all`}>
            <div className={`${isConfirm ? "flex" : "hidden"} justify-center transition-all absolute top-0 left-0 bg-black bg-opacity-50 w-full h-full z-10 gap-2`}>
                <button onClick={() => remove_workspace()} className='px-2 my-1 rounded-md bg-green-600 text-white font-bold text-sm'>
                    Delete
                </button>
                <button className='px-2 my-1 rounded-md bg-yellow-600 text-white font-bold text-sm' onClick={() => setConfirm(false)}>
                    Cancel
                </button>
            </div>
            <div className='lg:w-1/3 py-2'>
                {
                    isUpdateName ?
                        <input
                            autoFocus
                            className={`whitespace-nowrap text-slate-600 px-2 `}
                            type='text'
                            defaultValue={newWsName}
                            onChange={(e) => setNewWsName(e.target.value)}
                        />
                        :
                        <Link to={`/workspace/${workspaceItem.id}`} className='w-fit flex flex-col justify-start '>
                            <h3 className='whitespace-nowrap font-bold'>{workspaceItem.name}</h3>
                        </Link>
                }
                
                <span style={{ fontSize: "10px" }} className='text-start block'>({getTheTime(workspaceItem.updated_at)})</span>
            </div>
            <div className='flex w-2/3 flex-col-reverse lg:flex-row item-center justify-center my-1 gap-2'>
                <p className='hidden lg:flex justify-center items-center w-full'>
                    <span className='text-xs text-center block font-bold'>{workspaceItem.created_at}</span>
                </p>
                <div className='flex w-full justify-end items-center gap-2'>
                    {
                        isUpdateName ?
                            <button className='w-9 h-9 p-2 scale-90 rounded-sm bg-green-100' 
                            onClick={() => updateNewName()}>
                                <svg className='w-full h-full fill-green-600 lg:fill-green-700' version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="info" /><g id="icons"><path d="M10,18c-0.5,0-1-0.2-1.4-0.6l-4-4c-0.8-0.8-0.8-2,0-2.8c0.8-0.8,2.1-0.8,2.8,0l2.6,2.6l6.6-6.6   c0.8-0.8,2-0.8,2.8,0c0.8,0.8,0.8,2,0,2.8l-8,8C11,17.8,10.5,18,10,18z" id="check" /></g></svg>
                            </button>
                            :
                            <button className='w-9 h-9 p-2 scale-90 rounded-sm bg-blue-100' 
                            onClick={() => setUpdateName(true)}>
                                <svg className='w-full h-full stroke-blue-400 lg:stroke-blue-500' fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 5L18.2929 2.70711C18.6834 2.31658 19.3166 2.31658 19.7071 2.70711L21.2929 4.29289C21.6834 4.68342 21.6834 5.31658 21.2929 5.70711L19 8M16 5L10.2929 10.7071C10.1054 10.8946 10 11.149 10 11.4142V13C10 13.5523 10.4477 14 11 14H12.5858C12.851 14 13.1054 13.8946 13.2929 13.7071L19 8M16 5L19 8" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M6 14H5C3.89543 14 3 14.8954 3 16V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 18.8954 21 20V20C21 21.1046 20.1046 22 19 22H15" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                            </button>
                    }
                    <button className='w-8 h-8 p-2 rounded-sm bg-red-100' onClick={toggleConfirm}>
                        <svg className='w-full h-full fill-red-600 lg:hover:fill-red-700' viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M53.21 467c1.562 24.84 23.02 45 47.9 45h245.8c24.88 0 46.33-20.16 47.9-45L416 128H32L53.21 467zM432 32H320l-11.58-23.16c-2.709-5.42-8.25-8.844-14.31-8.844H153.9c-6.061 0-11.6 3.424-14.31 8.844L128 32H16c-8.836 0-16 7.162-16 16V80c0 8.836 7.164 16 16 16h416c8.838 0 16-7.164 16-16V48C448 39.16 440.8 32 432 32z" /></svg>
                    </button>
                </div>

            </div>
        </div>
    )
}

export default WorkspaceCard