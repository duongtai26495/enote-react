import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteItem from './NoteItem'

const NoteList = ({ id }) => {

    const [noteList, setNoteList] = useState([])

    const [isUpdateList, setUpdateList] = useState(false)

    const getAllNoteByWs = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && id > 0) {
            const result = await fetchApiData(`workspace/get/${id}`, token)
            const data = result.content
            setNoteList(data.reverse())
            setUpdateList(false)
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
        getAllNoteByWs()
    }, [id, isUpdateList])

    return (
        <RenderNote />
    )
}

export default NoteList