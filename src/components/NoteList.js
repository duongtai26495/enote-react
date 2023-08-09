import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteItem from './NoteItem'

const NoteList = ({ id, getNoteCount }) => {

    const [noteList, setNoteList] = useState([])

    const [isUpdateList, setUpdateList] = useState(false)

    const getAllNoteByWs = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && id > 0) {
            try {
                const result = await fetchApiData(`workspace/get/${id}`, token)
                if (result.status !== 403) {
                    const data = result.content
                    getNoteCount(data.length)
                    setNoteList(data.reverse())
                    setUpdateList(false)
                }
            } catch (error) {
                console.log(error)
            }

        }
    }

    const refreshNoteList = (update) => {
        setUpdateList(update)
    }
    const RenderNote = () => {
        return (
            noteList.map(item => (
                <NoteItem refreshNoteList={refreshNoteList} note={item} key={item.id} />
            ))
        )
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            getAllNoteByWs()
        }, 300);
        return () => clearTimeout(timeout);
    }, [id, isUpdateList])

    return (
        <RenderNote />
    )
}

export default NoteList