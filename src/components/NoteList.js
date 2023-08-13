import Cookies from 'js-cookie'
import React, { memo, useEffect, useState } from 'react'
import { access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteItem from './NoteItem'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

const NoteList = ({ id, getNoteCount, addNoteState }) => {

    const [noteList, setNoteList] = useState([])

    const [isUpdateList, setUpdateList] = useState(false)

    const getAllNoteByWs = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && id > 0) {
            try {
                const result = await fetchApiData(`workspace/get/${id}`, token)
                if (result && result.status !== 403) {
                    const data = result.content
                    getNoteCount(data.length)
                    setNoteList(data)
                    setUpdateList(false)
                }
            } catch (error) {
                console.log(error)
            }

        }
    }

    useEffect(() => {
        getAllNoteByWs()
    }, [addNoteState])

    const refreshNoteList = (update) => {
        setUpdateList(update)
    }
    const RenderNote = () => {
        return (
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1280: 4 }}>
                <Masonry>
                    {
                        noteList.map(item => (
                            <NoteItem refreshNoteList={refreshNoteList} note={item} key={item.id} />
                        ))
                    }
                </Masonry>
            </ResponsiveMasonry>
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