import Cookies from 'js-cookie'
import React, { memo, useEffect, useState } from 'react'
import { access_token, currentWs } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteItem from './NoteItem'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

const NoteList = ({ id, addNoteState, setAddNote }) => {

    const [noteList, setNoteList] = useState([])
    const [currentPage, setCurrentPage] = useState("1")
    const [maxPage, setMaxPage] = useState("1")


    const [isUpdateList, setUpdateList] = useState(false)

    const getAllNoteByWs = async () => {
        const token = Cookies.get(access_token)
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
            } finally {
                setUpdateList(false)
                setAddNote(false)
            }

        }
    }

    


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

    const setPage = (TYPE) => {
        switch (TYPE) {
            case "PREV":
                if (+currentPage > 1) { 
                    let current = Number(currentPage) - 1
                    setCurrentPage(current) 
                    localStorage.setItem("currentPage",current)
                }
                break;
            case "NEXT":
                if (currentPage < maxPage) { 
                    let current = Number(currentPage) + 1
                    setCurrentPage(current) 
                    localStorage.setItem("currentPage",current)
                }
                break;
        }
    }


    useEffect(() => {
        getAllNoteByWs()
    }, [id, isUpdateList, addNoteState, currentPage])


    const Pagination = () => {
        return (
            <p className='w-full text-center py-2'>
                <span className='cursor-pointer' onClick={() => setPage("PREV")}>PREV </span><span>{currentPage} / {maxPage}</span><span className='cursor-pointer' onClick={() => setPage("NEXT")}> NEXT</span>
            </p>
        )
    }



    return (
        <>
            <RenderNote />
            {
                noteList.length > 0 &&
            <Pagination />
            }
        </>
    )
}

export default NoteList