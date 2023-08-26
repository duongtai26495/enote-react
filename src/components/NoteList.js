import Cookies from 'js-cookie'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { access_token, currentWs } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteItem from './NoteItem'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

const NoteList = ({ id }) => {

    const [noteList, setNoteList] = useState([])
    const [currentPage, setCurrentPage] = useState("1")
    const [maxPage, setMaxPage] = useState("1")
    const token = Cookies.get(access_token)
    const getAllNoteByWs = async () => {
        if (checkToken(token) && id > 0) {
            try {
                let page = Number(currentPage) - 1
                let url = `workspace/get/${id}?page=${page}`
                const result = await fetchApiData(url, token)
                if (result && result.status !== 403) {
                    setMaxPage(result.totalPages)
                    const data = result.content
                    setNoteList(data)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }




    const removeNote = async (note) => {

        if (note.tasks === null || note.tasks.length < 1) {
            await fetchApiData(`note/remove/${note.id}`, token, "DELETE")
            const updatedItems = noteList.filter(item => item.id !== note.id);
            setNoteList(updatedItems);
        }
    }
    const RenderNote = React.memo(() => {
        return (
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 2, 900: 3, 1366: 4 }}>
                <Masonry>
                    {
                        noteList.map(item => (
                            <NoteItem removeNote={removeNote} note={item} key={item.id} />
                        ))
                    }
                </Masonry>
            </ResponsiveMasonry>
        )
    })

    const setPage = (TYPE) => {
        switch (TYPE) {
            case "PREV":
                if (+currentPage > 1) {
                    let current = Number(currentPage) - 1
                    setCurrentPage(current)
                    localStorage.setItem("currentPage", current)
                }
                break;
            case "NEXT":
                if (currentPage < maxPage) {
                    let current = Number(currentPage) + 1
                    setCurrentPage(current)
                    localStorage.setItem("currentPage", current)
                }
                break;
        }
    }

    const addNewNote = async () => {
        const token = Cookies.get(access_token)
        if (token !== null && checkToken(token)) {
            const newNote = {}
            newNote.workspace = { id }
            newNote.name = "Unnamed note"
            try {
                const result = await fetchApiData(`note/add`, token, "POST", newNote)
                
                const data = result.content
                const newList = [data, ...noteList]
                setNoteList(newList)
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getAllNoteByWs()
    }, [id, currentPage])


    const Pagination = () => {
        return (
            <p className='w-full text-center py-2'>
                <span className='cursor-pointer' onClick={() => setPage("PREV")}>PREV </span><span>{currentPage} / {maxPage}</span><span className='cursor-pointer' onClick={() => setPage("NEXT")}> NEXT</span>
            </p>
        )
    }

    return (
        <>
            <div className='w-full p-2  bg-slate-100 h-fit'>
                <span onClick={() => { addNewNote() }}
                    className={`cursor-pointer m-auto button_style-1 hover:bg-slate-200 w-fit h-fit font-bold rounded-sm px-2 text-center  p-1  bg-white text-black transition-all text-md `}>
                    Add note
                </span>
            </div>
            <RenderNote />
            {
                noteList.length > 0 &&
                <Pagination />
            }
        </>
    )
}

export default React.memo(NoteList)