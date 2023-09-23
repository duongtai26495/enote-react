import React from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import NoteList from '../components/NoteList'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { ACCESS_TOKEN, SUCCESS_RESULT } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'

const WorkspaceDetail = () => {

    const { id } = useParams()
    const [workspace, setWorkspace] = useState({})

    useEffect(() => {
        const getWorkspaceById = async () => {
            const token = Cookies.get(ACCESS_TOKEN)
            if (token && checkToken(token)) {
                const result = await fetchApiData(`workspace/info/${id}`, token)
                if (result.status === SUCCESS_RESULT) {
                    setWorkspace(result.content)
                }
            }
        }

        getWorkspaceById()
    }, [])


    return (
        <div className='w-full flex flex-col gap-2'>
            <div className={`${workspace ? "flex":"hidden"}`}>
                <h1>{workspace.name}</h1>
            </div>
            <Breadcrumbs text={"Back to home"} className={`w-full`} />

            <NoteList id={id} />
        </div>
    )
}

export default WorkspaceDetail