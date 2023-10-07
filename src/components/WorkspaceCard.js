import React, { useEffect, useRef } from 'react'
import { checkToken, fetchApiData, getTheTime } from '../utils/functions'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { ACCESS_TOKEN, COLS, GRID, SUCCESS_RESULT } from '../utils/constants'
import { useTranslation } from 'react-i18next'

const WorkspaceCard = ({ wsItem, removeWs, type }) => {

    const { t } = useTranslation()
    const [workspaceItem, setWorkspaceItem] = useState(wsItem)
    const [isConfirm, setConfirm] = useState(false)
    const [isUpdateName, setUpdateName] = useState(false)
    const [newWsName, setNewWsName] = useState(workspaceItem.name)
    const isMounted = useRef(false);
    const navigate = useNavigate()
    const [newFavorite, setFavorite] = useState(workspaceItem.favorite)

    const updateWs = async () => {
        let newName = newWsName
        if (newName === "" || newName === workspaceItem.name) {
            setNewWsName(workspaceItem.name)
            setUpdateName(false)
        } else {
            await updateWsById()
        }
    }

    const updateWsById = async () => {
        let newFav = newFavorite
        let wsName = (newWsName === "" || newWsName === workspaceItem.name) ? workspaceItem.name : newWsName
        const token = Cookies.get(ACCESS_TOKEN)
        let newWs = wsItem
        newWs.name = wsName
        newWs.favorite = newFav
        if (checkToken(token)) {
            const result = await fetchApiData(`workspace/update`, token, "PUT", newWs)
            if (result.status === SUCCESS_RESULT) {
                setWorkspaceItem(result.content)
                setUpdateName(false)
            }
        } else {

        }
    }
    useEffect(() => {
        if (isMounted.current) {
            updateWsById()
        } else {
            isMounted.current = true;
        }
    }, [newFavorite])

    const remove_workspace = async () => {
        removeWs(workspaceItem.id)
    }

    const toggleConfirm = () => {
        setConfirm(prevState => !prevState)
    }

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            await updateWs();
        }
    };

    const handleInputWsName = (e) => {
        let value = e.target.value
        setNewWsName(value)
    }

    const toggleFavorite = () => {
        setFavorite(prevState => !prevState)
    }

    return (
            <div className={`rounded mb-5 w-full flex-col relative bg-white  border shadow-sm overflow-hidden justify-between items-center lg:hover:shadow-lg transition-all`}>
                <div className={`${isConfirm ? "flex" : "hidden"} justify-center items-center transition-all absolute top-0 left-0 bg-black bg-opacity-50 w-full h-full z-50 gap-2`}>
                        <button onClick={() => remove_workspace()} className='p-2 h-fit my-1 rounded-md bg-green-600 text-white font-bold text-sm'>
                            {t('workspace.delete')}
                        </button>
                        <button className='p-2 h-fit my-1 rounded-md bg-yellow-600 text-white font-bold text-sm' onClick={() => setConfirm(false)}>
                            {t('workspace.cancel')}
                        </button>
                    </div>
                    <p className='hidden flex-col justify-center items-center w-full'>
                        <span className='text-xs lg:block hidden text-start font-bold'>{workspaceItem.created_at}</span>
                        <span className='text-xs text-start block font-bold'>({getTheTime(workspaceItem.created_at)})</span>
                    </p>
                <Link to={`/workspace/${workspaceItem.id}`}>

                    

                    {/* {
                    isUpdateName ?
                        <div className={`py-7 w-full text-center overflow-x-hidden px-2`}>
                            <input
                                autoFocus
                                className={`whitespace-nowrap text-xl bg-transparent outline-none border px-1 rounded-md text-slate-600 w-full `}
                                type='text'
                                onKeyDown={handleKeyPress}
                                defaultValue={newWsName}
                                onChange={handleInputWsName}
                            />
                        </div>
                        : */}
                    <div className={`py-5 w-full text-center overflow-x-hidden px-2`}>
                        <h3 className='text-lg lg:text-xl font-bold px-2'>{workspaceItem.name}</h3>
                        <span onClick={() => navigate(`/workspace/${workspaceItem.id}`)} style={{ fontSize: "10px" }}
                            className='cursor-pointer text-center flex items-center justify-center gap-1'>
                            <svg className='w-3 h-3' viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs></defs><title /><g dataname="Layer 15" id="Layer_15"><path className="cls-1" d="M16,31A15,15,0,1,1,31,16,15,15,0,0,1,16,31ZM16,3A13,13,0,1,0,29,16,13,13,0,0,0,16,3Z" /><path className="cls-1" d="M20.24,21.66l-4.95-4.95A1,1,0,0,1,15,16V8h2v7.59l4.66,4.65Z" /></g></svg>
                            {getTheTime(workspaceItem.updated_at)}</span>
                    </div>
                </Link>
                <div className='mx-auto border-t border-opacity-50  w-full py-3 flex item-center justify-center gap-2'>
                    <div className='flex w-full justify-center items-center gap-2'>

                        <span style={{ fontSize: "10px" }} className={`w-8 h-8 text-xs text-white flex items-center justify-center rounded-full bg-slate-500 ${workspaceItem.note_count > 0 ? "p-2" : "hidden"}`}>{workspaceItem.note_count > 0 ? "+" + workspaceItem.note_count : ""}</span>
                        {/* {
                            isUpdateName ?
                                <button className='w-9 h-9 p-2 scale-90 rounded-sm bg-green-100'
                                    onClick={() => updateWs()}>
                                    <svg className='w-full h-full fill-green-600 lg:fill-green-700' version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="info" /><g id="icons"><path d="M10,18c-0.5,0-1-0.2-1.4-0.6l-4-4c-0.8-0.8-0.8-2,0-2.8c0.8-0.8,2.1-0.8,2.8,0l2.6,2.6l6.6-6.6   c0.8-0.8,2-0.8,2.8,0c0.8,0.8,0.8,2,0,2.8l-8,8C11,17.8,10.5,18,10,18z" id="check" /></g></svg>
                                </button>
                                :
                                <button className='w-9 h-9 p-2 scale-90 rounded-sm bg-blue-100'
                                    onClick={() => setUpdateName(true)}>
                                    <svg className='w-full h-full stroke-blue-400 lg:stroke-blue-500' fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 5L18.2929 2.70711C18.6834 2.31658 19.3166 2.31658 19.7071 2.70711L21.2929 4.29289C21.6834 4.68342 21.6834 5.31658 21.2929 5.70711L19 8M16 5L10.2929 10.7071C10.1054 10.8946 10 11.149 10 11.4142V13C10 13.5523 10.4477 14 11 14H12.5858C12.851 14 13.1054 13.8946 13.2929 13.7071L19 8M16 5L19 8" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M6 14H5C3.89543 14 3 14.8954 3 16V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 18.8954 21 20V20C21 21.1046 20.1046 22 19 22H15" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                </button>
                        } */}
                        <button className={`${workspaceItem.note_count > 0 ? "hidden" : "flex"} w-8 h-8 p-2 rounded-sm bg-red-100`} onClick={toggleConfirm}>
                            <svg className='w-full h-full fill-red-600 lg:hover:fill-red-700' viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M53.21 467c1.562 24.84 23.02 45 47.9 45h245.8c24.88 0 46.33-20.16 47.9-45L416 128H32L53.21 467zM432 32H320l-11.58-23.16c-2.709-5.42-8.25-8.844-14.31-8.844H153.9c-6.061 0-11.6 3.424-14.31 8.844L128 32H16c-8.836 0-16 7.162-16 16V80c0 8.836 7.164 16 16 16h416c8.838 0 16-7.164 16-16V48C448 39.16 440.8 32 432 32z" /></svg>
                        </button>
                        <button onClick={toggleFavorite} className={`${workspaceItem.favorite ? "bg-amber-200" : "bg-slate-400"}  w-8 h-8 rounded-b-md transition-all`}>
                    <svg className={`mx-auto w-5 h-5 ${workspaceItem.favorite ? "fill-amber-500" : "fill-slate-600"} lg:hover:fill-amber-500`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 10.132v-6c0-1.103-.897-2-2-2H7c-1.103 0-2 .897-2 2V22l7-4.666L19 22V10.132z" /></svg>
                </button>
                    </div>

                </div>

              
            </div>
    )
}

export default WorkspaceCard