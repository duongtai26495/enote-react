import React, { useRef } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import NoteList from '../components/NoteList'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { ACCESS_TOKEN, SUCCESS_RESULT } from '../utils/constants'
import { checkToken, fetchApiData, getTheTime } from '../utils/functions'

const WorkspaceDetail = () => {

    const { id } = useParams()
    const [workspace, setWorkspace] = useState({})
    const [newNameWs, setNewNameWs] = useState(workspace.name)
    const newNameRef = useRef(null)

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

    const updateWs = async () => {
        const token = Cookies.get(ACCESS_TOKEN)
        if(token && checkToken(token)){

            let newName = newNameWs
            let newWs = workspace
            workspace.name = newName
            
            const result = await fetchApiData("workspace/update", token, "PUT",newWs)
            if(result.status === SUCCESS_RESULT){
                setWorkspace(result.content)
                setNewNameWs(result.content.name)
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
        <div className='w-full flex flex-col'>
            <div className={`flex bg-teal-500 p-4 items-center justify-between flex-nowrap gap-2`}>
            <div className='w-full lg:w-2/3'>
                <input type='text' 
                id='new_name_ws'
                name='new_name_ws'
                onBlur={updateWs}
                ref={newNameRef}
                className='text-xl text-white font-bold bg-transparent w-full'
                onKeyDown={handleKeyPress}
                onChange={(e)=>setNewNameWs(e.target.value)}
                defaultValue={newNameWs}
                />
                <p className='text-white whitespace-nowrap text-xs'>{workspace.updated_at ? getTheTime(workspace.updated_at) : ""}</p>
            </div>

                <p className='text-white whitespace-nowrap'>{workspace.created_at}</p>
            </div>
            <Breadcrumbs text={"Back to home"} className={`w-full`} />

            <NoteList id={id} />
        </div>
    )
}

export default WorkspaceDetail