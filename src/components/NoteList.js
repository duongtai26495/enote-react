import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteItem from './NoteItem'

const NoteList = ({ id }) => {

    const [noteList, setNoteList] = useState([])


    const getAllNoteByWs = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && id > 0) {
            const result = await fetchApiData(`workspace/get/${id}`, token)
            const data = result.content
            setNoteList(data)
        }
    }

    const RenderNote = () => {
        return (
            noteList.map(item => (
                <NoteItem note={item} key={item.id} />
            ))
        )
    }

    useEffect(() => {
        getAllNoteByWs()
    }, [id])

    return (
        <RenderNote />
    )
}

export default NoteList