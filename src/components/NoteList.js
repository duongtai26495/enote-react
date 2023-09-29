import Cookies from 'js-cookie'
import React, { memo, useEffect, useMemo, useState, useRef } from 'react'
import { SELECTED_SORT, SORT_ITEMS, ACCESS_TOKEN, CURRENT_WS, CURRENT_NOTE_PAGE } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteItem from './NoteItem'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import EmptyList from './EmptyList'
import Pagination from './Pagination'
import { useParams } from 'react-router-dom'

const NoteList = () => {

    const { id } = useParams()
    const [noteList, setNoteList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [selectedSort, setSelectedSort] = useState(JSON.parse(localStorage.getItem(SELECTED_SORT)) ?? "updated_at_desc")
    const firstPage = 1
    const token = Cookies.get(ACCESS_TOKEN)
    const sortValues = JSON.parse(localStorage.getItem(SORT_ITEMS))
    const isMounted = useRef(false);
    const [deleteId, setDeleteId] = useState(null)

    const [elementPerPage, setElPerPage] = useState(0)
    const [maxElelentPerPage, setMaxElPerPage] = useState(0)
    const [emptyList, setEmptyList] = useState(true)


    useEffect(() => {
        getAllNoteByWs()
    }, [currentPage, selectedSort])

    useEffect(() => {
        if (isMounted.current) {
            updateNoteList()
        } else {
            isMounted.current = true;
        }
    }, [maxPage, deleteId])


    const getAllNoteByWs = async () => {
        if (checkToken(token) && id > 0) {
            try {
                const result = await getAllNoteInBackground()
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

    const getAllNoteInBackground = async () => {
        let page = Number(currentPage) - 1
        let url = `workspace/get/${id}?page=${page}&size=12&sort=${selectedSort}`
        const result = await fetchApiData(url, token)
        const maxPageResult = result.totalPages
        const data = result.content
        if (data && data?.length > 0) {
            setNoteList(result.content);
        } else {
            setNoteList([])
            setCurrentPage(1)
        }
        setEmptyList(result.empty)
        setElPerPage(result.totalElements)
        setMaxElPerPage(result.size)
        setMaxPage(maxPageResult)
        return result
    }


    const removeNote = (id) => {
        setDeleteId(id)
    }

    const removeNoteById = async () => {
        if (deleteId) {
            const token = Cookies.get(ACCESS_TOKEN)
            await fetchApiData(`note/remove/${deleteId}`, token, "DELETE")
            setDeleteId(null)
        }
    }

    const RenderNote = React.memo(() => {
        return (
            <ResponsiveMasonry className='h-fit masonry-wrapper' columnsCountBreakPoints={{ 350: 2, 767: 3, 960: 3 }}>
                <Masonry>
                    {
                        noteList?.map((item, index) => (
                            <NoteItem key={item.id} removeNote={removeNote} note={item} subclass={``} />
                        ))
                    }
                </Masonry>
            </ResponsiveMasonry>
        )
    })

    const setPage = (TYPE) => {
        switch (TYPE) {
            case "PREV":
                if (currentPage > 1) {
                    let current = Number(currentPage) - 1
                    setCurrentPage(current)
                    localStorage.setItem(CURRENT_NOTE_PAGE, current)
                }
                break;
            case "NEXT":
                if (currentPage < maxPage) {
                    let current = Number(currentPage) + 1
                    setCurrentPage(current)
                    localStorage.setItem(CURRENT_NOTE_PAGE, current)
                }
                break;
        }
    }

    const updateNoteList = async () => {
        let newNoteList = noteList;
        if (deleteId) {
            newNoteList = noteList.filter(item => item.id !== deleteId);
            await removeNoteById()
        }

        if (newNoteList?.length < maxElelentPerPage) {
            await getAllNoteInBackground()
        } else {
            setNoteList(newNoteList)
        }
    }

    const addNewNote = async () => {
        if (id) {
            const token = Cookies.get(ACCESS_TOKEN)
            if (token !== null && checkToken(token)) {
                const newNote = {}
                newNote.workspace = { id }
                newNote.name = "Unnamed note"
                try {
                    const result = await fetchApiData(`note/add`, token, "POST", newNote)

                    const data = result.content
                    if (noteList?.length >= maxElelentPerPage) {
                        await getAllNoteInBackground()
                    } else {
                        noteList ? setNoteList(oldData => [data, ...oldData]) : setNoteList(data)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }


    const sortHandle = (value) => {
        setSelectedSort(value.target.value)
        localStorage.setItem(SELECTED_SORT, JSON.stringify(value.target.value))
    }

    const RenderSort = () => {
        return (
            <select className='w-1/2 lg:w-fit bg-white border p-1 rounded-md text-sm' name='sort_note' id='sort_note'
                value={selectedSort} onChange={(e) => sortHandle(e)}>
                {sortValues?.map((item, index) => {
                    return (
                        <option key={index} value={item.value}>{item.name}</option>
                    );
                })}

            </select>
        )
    }

    return (
        <>
            <div className={`w-full p-2 gap-2 flex flex-row items-center justify-between bg-slate-100 h-fit sticky top-0 z-40`}>
                <span onClick={() => { addNewNote() }}
                    className={`cursor-pointer button_style-1 whitespace-nowrap lg:hover:bg-slate-200 w-1/3 lg:w-fit h-fit font-bold px-2 text-center rounded-md p-1  bg-white text-black transition-all text-sm`}>
                    Add note
                </span>
                <RenderSort />

            </div>
            {
                noteList.length > 0 ?
                    <>
                        <RenderNote />
                        <Pagination
                            className={`${noteList.length > 0 ? "flex" : "hidden"} overflow-hidden justify-center my-5 `}
                            currentPage={currentPage}
                            maxPage={maxPage}
                            firstPage={firstPage}
                            setCurrentPage={setCurrentPage}
                            setPage={setPage}
                        />
                    </>
                    :
                    <EmptyList />
            }
        </>
    )
}

export default React.memo(NoteList)