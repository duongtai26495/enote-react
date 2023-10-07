import React, { useRef } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import NoteList from '../components/NoteList'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { ACCESS_TOKEN, PRIMARY_WS, SUCCESS_RESULT } from '../utils/constants'
import { checkToken, fetchApiData, getTheTime } from '../utils/functions'
import { useTranslation } from 'react-i18next'

const WorkspaceDetail = () => {

    const { t } = useTranslation()
    const { id } = useParams()
    const [workspace, setWorkspace] = useState({})
    const [newNameWs, setNewNameWs] = useState(workspace.name)
    const newNameRef = useRef(null)
    const [default_ws, setDefaultWs] = useState(localStorage.getItem(PRIMARY_WS) ?? 0)
    const [isUpdatingName, setUpdatingName] = useState(false)

    useEffect(() => {
        const getWorkspaceById = async () => {
            const token = Cookies.get(ACCESS_TOKEN)
            if (token && checkToken(token)) {
                const result = await fetchApiData(`workspace/info/${id}`, token)
                if (result.status === SUCCESS_RESULT) {
                    setWorkspace(result.content)
                    setNewNameWs(result.content.name)
                }
            }
        }

        getWorkspaceById()
    }, [id])

    const setWsDefault = () => {
        localStorage.removeItem(PRIMARY_WS)
        localStorage.setItem(PRIMARY_WS, workspace.id)
        setDefaultWs(workspace.id)
    }
    const removeWsDefault = () => {
        localStorage.removeItem(PRIMARY_WS)
        setDefaultWs(0)
    }

    const updateWs = async () => {
        const token = Cookies.get(ACCESS_TOKEN)
        if (token && checkToken(token)) {

            let newName = newNameWs
            let newWs = workspace
            workspace.name = newName

            const result = await fetchApiData("workspace/update", token, "PUT", newWs)
            if (result.status === SUCCESS_RESULT) {
                setWorkspace(result.content)
                setNewNameWs(result.content.name)
                setUpdatingName(false)
            }
        }
    }
    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            await updateWs()
            newNameRef.current.blur()
        }
    };


    return (
        <div className='w-full flex flex-col relative shadow-lg my-5 rounded-lg border overflow-hidden'>
            <div className={`flex flex-col lg:flex-row bg-teal-500 p-4 items-start lg:items-center justify-between flex-nowrap gap-2`}>
                <div className='w-full lg:w-2/3'>
                    <div className='flex gap-1 items-center'>
                        {isUpdatingName ?
                            <input type='text'
                                id='new_name_ws'
                                name='new_name_ws'
                                onBlur={updateWs}
                                autoFocus
                                ref={newNameRef}
                                className='text-xl text-white font-bold bg-transparent w-fit'
                                onKeyDown={handleKeyPress}
                                onChange={(e) => setNewNameWs(e.target.value)}
                                defaultValue={newNameWs}
                            />
                            :
                            <p className='text-xl text-white font-bold bg-transparent w-fit'>{workspace.name}</p>
                        }
                        {
                            isUpdatingName ?
                                <button className='w-fit h-fit  scale-90 rounded-md bg-white px-2 py-1'
                                    onClick={() => updateWs()}>
                                    <svg className='w-6 h-6 fill-green-600 lg:fill-green-700' version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="info" /><g id="icons"><path d="M10,18c-0.5,0-1-0.2-1.4-0.6l-4-4c-0.8-0.8-0.8-2,0-2.8c0.8-0.8,2.1-0.8,2.8,0l2.6,2.6l6.6-6.6   c0.8-0.8,2-0.8,2.8,0c0.8,0.8,0.8,2,0,2.8l-8,8C11,17.8,10.5,18,10,18z" id="check" /></g></svg>
                                </button>
                                :
                                <button className='w-fit h-fit  scale-90 rounded-md bg-white px-2 py-1'
                                    onClick={() => setUpdatingName(true)}>
                                    <svg className='w-6 h-6 stroke-blue-400 lg:stroke-blue-500' fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 5L18.2929 2.70711C18.6834 2.31658 19.3166 2.31658 19.7071 2.70711L21.2929 4.29289C21.6834 4.68342 21.6834 5.31658 21.2929 5.70711L19 8M16 5L10.2929 10.7071C10.1054 10.8946 10 11.149 10 11.4142V13C10 13.5523 10.4477 14 11 14H12.5858C12.851 14 13.1054 13.8946 13.2929 13.7071L19 8M16 5L19 8" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M6 14H5C3.89543 14 3 14.8954 3 16V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 18.8954 21 20V20C21 21.1046 20.1046 22 19 22H15" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                </button>
                        }
                    </div>
                    <p className='text-white whitespace-nowrap text-xs w-fit'>{workspace.updated_at ? t('common.updated_at', { value: getTheTime(workspace.updated_at) }) : ""}</p>
                </div>
                <p className='text-white text-sm whitespace-nowrap'>{workspace.created_at}</p>

                <div className=' gap-2 hidden'>
                    <button onClick={() => setWsDefault()}
                        disabled={default_ws === workspace.id}
                        className={`text-sm text-slate-900 whitespace-nowrap rounded-md bg-white p-2 shadow lg:hover:shadow-lg transition-all`}>
                        {t('workspace.set_as_default')}
                    </button>
                    <button onClick={() => removeWsDefault()}
                        disabled={default_ws !== workspace.id}
                        className={`${default_ws === workspace.id ? "bg-white" : "bg-slate-300"} text-sm text-slate-900 whitespace-nowrap rounded-md  p-2 shadow lg:hover:shadow-lg transition-all`}>
                        {t('workspace.remove_default')}
                    </button>
                </div>
            </div>

            <Breadcrumbs localtion={"/"} text={t('common.back_to_home')} className={`${default_ws !== workspace.id ? "flex" : "hidden"} w-full bg-transparent border-b`} />

            <NoteList />
        </div>
    )
}

export default WorkspaceDetail